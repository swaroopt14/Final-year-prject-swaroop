from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from langchain_google_genai import ChatGoogleGenerativeAI

try:
    from .graph import Deps, build_graph
except ImportError:
    # Allows uvicorn main:app --app-dir python-agent-service
    from graph import Deps, build_graph


class WorkflowRequest(BaseModel):
    patientId: str = Field(..., min_length=1)
    riskScore: Optional[float] = None
    vitals: Dict[str, Any] = Field(default_factory=dict)
    drugs: List[str] = Field(default_factory=list)
    noteText: Optional[str] = None


class WorkflowResponse(BaseModel):
    patientId: str
    riskScore: float
    recommendedAction: str
    interactions: List[Dict[str, Any]]
    llmSummary: str
    audit: List[Dict[str, Any]]


def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is required")
    model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    return ChatGoogleGenerativeAI(model=model, google_api_key=api_key, temperature=0.2)


def _fallback_workflow(req: WorkflowRequest, error: str) -> WorkflowResponse:
    risk = float(req.riskScore or 0.0)
    severe_interactions = 0
    lowered = {d.lower() for d in (req.drugs or [])}
    if {"warfarin", "aspirin"}.issubset(lowered):
        severe_interactions += 1
    if {"metformin", "contrast_dye"}.issubset(lowered):
        severe_interactions += 1

    recommended = "observe"
    if risk >= 0.8 or severe_interactions > 0:
        recommended = "admit"

    summary = (
        "LLM unavailable; returned deterministic safety fallback. "
        f"riskScore={risk:.2f}, severeInteractions={severe_interactions}."
    )

    return WorkflowResponse(
        patientId=req.patientId,
        riskScore=risk,
        recommendedAction=recommended,
        interactions=[],
        llmSummary=summary,
        audit=[
            {"step": "fallback", "reason": "llm_unavailable"},
            {"error": error},
        ],
    )


app = FastAPI(title="Smart Hospital Agent Service (LangGraph)", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/workflow/run", response_model=WorkflowResponse)
def run_workflow(req: WorkflowRequest):
    try:
        llm = get_llm()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    graph = build_graph(Deps(llm=llm))
    try:
        out = graph.invoke(
            {
                "patient_id": req.patientId,
                "risk_score": float(req.riskScore or 0.0),
                "vitals": req.vitals or {},
                "drugs": req.drugs or [],
                "note_text": req.noteText or "",
                "audit": [],
            }
        )

        return WorkflowResponse(
            patientId=req.patientId,
            riskScore=float(out.get("risk_score") or float(req.riskScore or 0.0)),
            recommendedAction=str(out.get("recommended_action") or "observe"),
            interactions=list(out.get("interactions") or []),
            llmSummary=str(out.get("llm_summary") or ""),
            audit=list(out.get("audit") or []),
        )
    except Exception as e:
        return _fallback_workflow(req, str(e))
