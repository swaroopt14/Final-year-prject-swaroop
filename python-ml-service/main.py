from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import Any, Dict, Optional, List

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    patient: Dict[str, Any] = Field(default_factory=dict)


class PredictResponse(BaseModel):
    prediction: Dict[str, Any]


class NoteAnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)


class NoteEntity(BaseModel):
    text: str
    label: str
    score: float


class NoteAnalyzeResponse(BaseModel):
    summary: str
    entities: List[NoteEntity] = Field(default_factory=list)


class QLearningUpdateRequest(BaseModel):
    state: str = Field(..., min_length=1)
    action: str = Field(..., min_length=1)
    reward: float
    next_state: Optional[str] = None
    alpha: float = 0.1
    gamma: float = 0.9


class QLearningUpdateResponse(BaseModel):
    state: str
    action: str
    updated_q: float
    next_state: Optional[str] = None
    next_max_q: float


@dataclass
class ModelBundle:
    logistic: Optional[Any]
    random_forest: Optional[Any]


@dataclass
class BertRuntime:
    tokenizer: Optional[Any]
    model: Optional[Any]
    ner_pipeline: Optional[Any]
    torch: Optional[Any]
    error: Optional[str]


def _feature_vector(patient: Dict[str, Any]) -> np.ndarray:
    age = float(patient.get("age", 50))
    num_comorbidities = float(patient.get("num_comorbidities", 0))
    systolic_mm_hg = float(patient.get("systolicMmHg", 120))
    spo2_pct = float(patient.get("spo2Pct", 96))
    temperature_c = float(patient.get("temperatureC", 37))
    # Stable feature order for training/inference compatibility.
    return np.array([[age, num_comorbidities, systolic_mm_hg, spo2_pct, temperature_c]], dtype=np.float32)


def _sigmoid(z: float) -> float:
    return float(1.0 / (1.0 + np.exp(-z)))


def load_models() -> ModelBundle:
    base = os.path.join(os.path.dirname(__file__), "models")
    logistic_path = os.path.join(base, "logistic.pkl")
    rf_path = os.path.join(base, "rf.pkl")

    logistic = joblib.load(logistic_path) if os.path.exists(logistic_path) else None
    random_forest = joblib.load(rf_path) if os.path.exists(rf_path) else None
    return ModelBundle(logistic=logistic, random_forest=random_forest)


models = load_models()
app = FastAPI(title="Smart Hospital ML Service", version="0.1.0")
q_table: Dict[str, float] = {}
bert_runtime: Optional[BertRuntime] = None


def _get_bert_runtime() -> BertRuntime:
    global bert_runtime
    if bert_runtime is not None:
        return bert_runtime

    model_name = os.getenv("CLINICAL_BERT_MODEL", "emilyalsentzer/Bio_ClinicalBERT")
    ner_name = os.getenv("CLINICAL_NER_MODEL", "d4data/biomedical-ner-all")

    try:
        import torch  # type: ignore
        from transformers import AutoModel, AutoTokenizer, pipeline  # type: ignore

        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModel.from_pretrained(model_name)
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model.to(device)
        model.eval()

        ner_pipeline = None
        try:
            ner_device = 0 if torch.cuda.is_available() else -1
            ner_pipeline = pipeline("token-classification", model=ner_name, aggregation_strategy="simple", device=ner_device)
        except Exception:
            # NER is optional; keep BERT embedding path active.
            ner_pipeline = None

        bert_runtime = BertRuntime(
            tokenizer=tokenizer,
            model=model,
            ner_pipeline=ner_pipeline,
            torch=torch,
            error=None,
        )
        return bert_runtime
    except Exception as e:
        bert_runtime = BertRuntime(
            tokenizer=None,
            model=None,
            ner_pipeline=None,
            torch=None,
            error=str(e),
        )
        return bert_runtime


def _bert_embedding(text: str, runtime: BertRuntime) -> np.ndarray:
    if runtime.tokenizer is None or runtime.model is None or runtime.torch is None:
        return np.zeros(768, dtype=np.float32)

    tok = runtime.tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=256,
        padding=True,
    )
    device = next(runtime.model.parameters()).device
    tok = {k: v.to(device) for k, v in tok.items()}
    with runtime.torch.no_grad():
        out = runtime.model(**tok)
    last_hidden = out.last_hidden_state
    attn = tok["attention_mask"].unsqueeze(-1)
    pooled = (last_hidden * attn).sum(dim=1) / attn.sum(dim=1).clamp(min=1)
    return pooled[0].detach().cpu().numpy().astype(np.float32)


def _cosine(a: np.ndarray, b: np.ndarray) -> float:
    denom = float(np.linalg.norm(a) * np.linalg.norm(b))
    if denom <= 1e-12:
        return 0.0
    return float(np.dot(a, b) / denom)


def _bert_summary(text: str, runtime: BertRuntime) -> str:
    compact = " ".join(text.split())
    if len(compact) <= 280 or runtime.model is None or runtime.tokenizer is None:
        return compact[:280] + ("..." if len(compact) > 280 else "")

    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", compact) if s.strip()]
    if len(sentences) <= 2:
        return compact[:280] + ("..." if len(compact) > 280 else "")

    doc_emb = _bert_embedding(compact, runtime)
    scored: List[tuple[float, str]] = []
    for s in sentences:
        emb = _bert_embedding(s, runtime)
        scored.append((_cosine(doc_emb, emb), s))
    top = sorted(scored, key=lambda x: x[0], reverse=True)[: min(3, len(scored))]
    summary = " ".join(s for _, s in top)
    return summary[:320] + ("..." if len(summary) > 320 else "")


def _fallback_entities(text: str) -> List[NoteEntity]:
    low = text.lower()
    entities: List[NoteEntity] = []
    rules = [
        ("chest pain", "SYMPTOM", 0.90),
        ("shortness of breath", "SYMPTOM", 0.88),
        ("dyspnea", "SYMPTOM", 0.85),
        ("troponin", "LAB_MARKER", 0.86),
        ("sepsis", "CONDITION", 0.84),
        ("fever", "SIGN", 0.80),
        ("hypotension", "SIGN", 0.80),
        ("tachycardia", "SIGN", 0.78),
    ]
    for token, label, score in rules:
        if token in low:
            entities.append(NoteEntity(text=token, label=label, score=score))
    return entities


@app.get("/health")
def health() -> Dict[str, Any]:
    loaded = bert_runtime is not None and bert_runtime.model is not None
    ner_loaded = bert_runtime is not None and bert_runtime.ner_pipeline is not None
    bert_err = bert_runtime.error if bert_runtime is not None else None
    return {
        "status": "ok",
        "logistic_loaded": models.logistic is not None,
        "random_forest_loaded": models.random_forest is not None,
        "clinicalbert_loaded": loaded,
        "clinical_ner_loaded": ner_loaded,
        "clinicalbert_error": bert_err,
    }


def _predict_impl(req: PredictRequest) -> PredictResponse:
    x = _feature_vector(req.patient)

    # Primary: use RandomForest if present, otherwise Logistic, otherwise fallback rule.
    if models.random_forest is not None:
        try:
            proba = models.random_forest.predict_proba(x)[0][1]
            return PredictResponse(prediction={"risk_score": float(proba), "model": "random_forest"})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"rf_predict_failed: {e}")

    if models.logistic is not None:
        try:
            proba = models.logistic.predict_proba(x)[0][1]
            return PredictResponse(prediction={"risk_score": float(proba), "model": "logistic_regression"})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"logistic_predict_failed: {e}")

    # Fallback: simple explainable score (keeps demo working without artifacts)
    age = float(req.patient.get("age", 50))
    num = float(req.patient.get("num_comorbidities", 0))
    systolic = float(req.patient.get("systolicMmHg", 120))
    spo2 = float(req.patient.get("spo2Pct", 96))
    temperature = float(req.patient.get("temperatureC", 37))
    z = (
        -2.0
        + 0.01 * age
        + 0.15 * num
        + 0.006 * max(0.0, systolic - 120.0)
        + 0.30 * max(0.0, 92.0 - spo2)
        + 0.40 * max(0.0, temperature - 38.0)
    )
    return PredictResponse(prediction={"risk_score": _sigmoid(z), "model": "fallback"})


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    # Backward-compatible endpoint.
    return _predict_impl(req)


@app.post("/predict/risk", response_model=PredictResponse)
def predict_risk(req: PredictRequest) -> PredictResponse:
    return _predict_impl(req)


@app.post("/analyze/notes", response_model=NoteAnalyzeResponse)
def analyze_notes(req: NoteAnalyzeRequest) -> NoteAnalyzeResponse:
    text = " ".join(req.text.split())
    runtime = _get_bert_runtime()
    summary = _bert_summary(text, runtime)
    entities: List[NoteEntity] = []
    if runtime.ner_pipeline is not None:
        try:
            raw = runtime.ner_pipeline(text)
            entities = [
                NoteEntity(
                    text=str(r.get("word", "")).strip(),
                    label=str(r.get("entity_group", "ENTITY")).strip(),
                    score=float(r.get("score", 0.5)),
                )
                for r in raw
                if str(r.get("word", "")).strip()
            ]
        except Exception:
            entities = _fallback_entities(text)
    else:
        entities = _fallback_entities(text)

    return NoteAnalyzeResponse(summary=summary, entities=entities)


def _max_q_for_state(state: str) -> float:
    prefix = f"{state}::"
    values = [v for k, v in q_table.items() if k.startswith(prefix)]
    return max(values) if values else 0.0


@app.post("/qlearning/update", response_model=QLearningUpdateResponse)
def qlearning_update(req: QLearningUpdateRequest) -> QLearningUpdateResponse:
    key = f"{req.state}::{req.action}"
    current = q_table.get(key, 0.0)
    next_max = _max_q_for_state(req.next_state) if req.next_state else 0.0
    updated = current + req.alpha * (req.reward + req.gamma * next_max - current)
    q_table[key] = float(updated)
    return QLearningUpdateResponse(
        state=req.state,
        action=req.action,
        updated_q=float(updated),
        next_state=req.next_state,
        next_max_q=float(next_max),
    )
