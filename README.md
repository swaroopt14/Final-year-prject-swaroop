# SmartCare+ — AI-Powered Multi-Agent Smart Hospital System

Final-year project that walks through an Acute Stroke Emergency case study using a multi-agent AI platform: Doctor, Nurse, Drug Checker, Admin, plus an orchestrated LangGraph workflow with a real ML risk model and a Gemini-backed clinical summary.

> **Build state:** the repo is mid-MVP. See [`MVP_PLAN.md`](./MVP_PLAN.md) for the day-by-day execution plan and current status.

---

## Architecture (real, not aspirational)

```
            ┌──────────────────────────────────────┐
            │  Next.js 16 — frontend2              │
            │  /login  /[slug] dashboards          │  port 3001
            └──────────────┬───────────────────────┘
                           │ HTTPS + JWT cookie
                           ▼
            ┌──────────────────────────────────────┐
            │  Node + Express + TypeScript — src/  │  port 3000
            │  Auth · EHR · Lab · Vitals · Pharmacy│
            │  Agents orchestrator · SSE stream    │
            └─┬────────────────┬────────────────┬──┘
              │                │                │
              ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────────┐  ┌─────────────────────┐
    │ MongoDB 7    │  │ python-ml-       │  │ python-agent-       │
    │ (ai_smart_   │  │ service          │  │ service             │
    │  hospital)   │  │ FastAPI          │  │ FastAPI + LangGraph │
    │ port 27017   │  │ scikit-learn     │  │ + Gemini fallback   │
    │              │  │ ClinicalBERT     │  │                     │
    │              │  │ port 5000        │  │ port 7000           │
    └──────────────┘  └──────────────────┘  └─────────────────────┘
```

Stack lock-in:
- Frontend: `frontend2/` only.
- Node API: `src/`.
- Python services: `python-ml-service/` + `python-agent-service/`.
- DB: MongoDB locally; Cosmos DB Mongo API in cloud.
- Cloud target: Azure Container Apps (primary), AWS ECS Fargate (fallback).

---

## Quick start (Docker Compose, all services)

```bash
cp .env.example .env
# Edit .env: set GEMINI_API_KEY (optional, falls back to stub) and JWT_SECRET
docker compose up
```

This brings up:
- `mongo` on `:27017`
- `ml-service` on `:5000` (FastAPI, scikit-learn + ClinicalBERT)
- `agent-service` on `:7000` (FastAPI + LangGraph + Gemini)
- `api` on `:3000` (Node Express, runs `npm install`, `npm run seed`, `npm run dev`)
- `web` on `:3001` (Next.js dashboard)

Verify health:

```bash
curl http://localhost:3000/api/health
curl http://localhost:5000/health
curl http://localhost:7000/health
```

---

## Train the ML risk model (one-time)

The ML service falls back to a deterministic sigmoid until trained `.pkl` files exist. Run the trainer once to produce real models:

```bash
# Use the project venv (already created at .venv-ml312)
source .venv-ml312/bin/activate
pip install -r python-ml-service/requirements.txt
python models/classical/logistic_regression/train.py
```

This writes `python-ml-service/models/logistic.pkl` and `python-ml-service/models/rf.pkl`. The ML service auto-loads them on startup.

Verify with a stroke-style payload:

```bash
curl -sS -X POST http://localhost:5000/predict \
  -H 'Content-Type: application/json' \
  -d '{"patient":{"age":72,"num_comorbidities":2,"systolic_bp":178,"spo2":92,"temperature_c":37.2}}' | jq
# expect probability >= 0.6 with model_used = "logistic_regression" (not "fallback")
```

---

## Frontend dashboard

```bash
cd frontend2
npm install
npm run dev
# http://localhost:3001
```

Wires to the Node API at `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:3000`).

---

## API surface (Node, port 3000)

- `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me`
- `GET /api/ehr/patients` · `GET /api/ehr/patients/:id`
- `GET /api/vitals/records?patientId=` · `POST /api/vitals/records`
- `GET /api/lab/reports?patientId=` · `POST /api/lab/reports`
- `POST /api/pharmacy/prescription/check`
- `POST /api/agents/doctor/evaluate` (Doctor → Chief → DrugChecker → LangGraph → Audit)
- `GET /api/agents/decisions` (audit log)
- `GET /api/events/stream` (SSE: `vitals.stream`, `high_risk_alert`, `drug_alert`)
- `POST /api/simulations/start` · `POST /api/simulations/stop`

Curl-by-curl walkthrough lives in [`BACKEND_CURL_TESTS.md`](./BACKEND_CURL_TESTS.md).

---

## Repo map

```
fp/
├── src/                      # Node + Express API (TypeScript)
│   ├── modules/
│   │   ├── ehr/  lab/  vitals/  pharmacy/  agents/  simulations/  auth/
│   ├── events/               # SSE + Kafka-mock event bus
│   ├── middlewares/          # JWT auth, error handler, request log
│   └── scripts/              # seed.ts, issue-token.ts
├── python-ml-service/        # FastAPI: /predict, /predict/risk, /analyze/notes, /qlearning/update
│   ├── main.py
│   └── models/               # logistic.pkl, rf.pkl (generated)
├── python-agent-service/     # FastAPI + LangGraph 4-node graph (Gemini)
│   ├── main.py
│   └── graph.py              # nurse_triage → doctor_assess → drug_check → llm_summarize
├── models/classical/         # Trainer scripts (synthetic data → .pkl)
├── frontend2/                # Next.js 16 dashboard (only frontend)
├── tests/                    # vitest (Node side)
├── docker-compose.yml
├── .env.example
├── ARCHITECTURE.md
├── MVP_PLAN.md               # 12-day execution plan
└── README.md
```

---

## Project documentation

- [`docs/STARTUP_MVP_4DAY_PLAN.md`](./docs/STARTUP_MVP_4DAY_PLAN.md) — **active** startup MVP sprint (Days 3–6)
- [`docs/SAYALI_CHECKLIST.md`](./docs/SAYALI_CHECKLIST.md) — Sayali daily tasks + git push
- [`docs/MIKE_CHECKLIST.md`](./docs/MIKE_CHECKLIST.md) — Mike daily tasks + git push
- [`docs/TEAM_4DAY_MVP_GUIDE.md`](./docs/TEAM_4DAY_MVP_GUIDE.md) — parallel workflow + smoke tests
- [`MVP_PLAN.md`](./MVP_PLAN.md) — original 12-day plan (archive)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — long-form architecture notes
- [`BACKEND_CURL_TESTS.md`](./BACKEND_CURL_TESTS.md) — curl recipes for every endpoint

## License

Academic project, PCCOE Department of Computer Engineering, 2025–26.
