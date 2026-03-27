# Python Agent Service (LangGraph + Gemini)

Purpose: run multi-agent workflows using **LangGraph**, with LLM reasoning via **Gemini**.

## Env
- `GEMINI_API_KEY` (required)

## Run
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r python-agent-service/requirements.txt
export GEMINI_API_KEY="..."
uvicorn python-agent-service.main:app --host 127.0.0.1 --port 7000
```

## API
- `POST /workflow/run`
  - body: `{ "patientId": "...", "riskScore": 0.81, "vitals": {...}, "drugs": ["warfarin","aspirin"], "noteText": "..." }`

