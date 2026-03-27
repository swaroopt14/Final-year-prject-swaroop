# Python ML Service (FastAPI)

Purpose: lightweight microservice for classical ML inference (Logistic Regression / Random Forest) used by the Node backend.

## Train models
```bash
python models/classical/logistic_regression/train.py
```

This writes:
- `python-ml-service/models/logistic.pkl`
- `python-ml-service/models/rf.pkl`

## Run
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r python-ml-service/requirements.txt
uvicorn python-ml-service.main:app --host 127.0.0.1 --port 5000
```

Optional environment variables for NLP model selection:
- `CLINICAL_BERT_MODEL` (default: `emilyalsentzer/Bio_ClinicalBERT`)
- `CLINICAL_NER_MODEL` (default: `d4data/biomedical-ner-all`)

## API
- `GET /health`
- `POST /predict/risk` body: `{ "patient": { "age": 72, "num_comorbidities": 2 } }`
- `POST /predict` (backward-compatible alias)
- `POST /analyze/notes` body: `{ "text": "clinical note..." }`
- `POST /qlearning/update` body:
  - `state`, `action`, `reward`, `next_state?`, `alpha?`, `gamma?`

Optional vitals fields can also be provided to improve scoring:
- `systolicMmHg`
- `spo2Pct`
- `temperatureC`

If `python-ml-service/models/logistic.pkl` or `python-ml-service/models/rf.pkl` exist, they are loaded via `joblib`.
