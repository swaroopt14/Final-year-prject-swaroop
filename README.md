# Smart Hospital — Multi-Agent AI System (Research-ready scaffold)

This repository provides a concise, research-oriented scaffold for building, evaluating, and demonstrating a Multi-Agent Smart Hospital System suitable for a final-year engineering project, conference or journal submission, and an interactive demo/viva.

Goals
- Provide a Python-first backend and CI-friendly structure for reproducible experiments.
- Use classical ML (Logistic Regression, Random Forest) for transparent, explainable decision models.
- Combine small ML models with LLM-powered agent tooling (LangChain) and orchestrate multi-agent flows with LangGraph.
- Be Vertex AI–ready for later cloud deployment while remaining runnable locally.

Node.js Backend (Production API)
- This repo now includes a production-grade Node.js + Express + TypeScript API under `src/`.
- Modular modules: EHR, Lab, Vitals, Pharmacy, Agents; plus events, middleware, utilities.
- Event-driven alerts are delivered via a Kafka-style in-memory event bus (mock) and exposed to the frontend via SSE.

Core concepts (concise)
- ML models: trained with `scikit-learn`, stored as artifacts in `models/` and explained via SHAP/LIME in `models/explainability/`.
- Agents: `Doctor`, `Nurse`, `Drug Checker`, `Admin` implemented as LangChain tools/adapters in `agents/`. Each agent has an `agent_spec.yaml` and lightweight tools that call ML services or rules.
- Orchestration: LangGraph workflows in `orchestration/langgraph/graphs/` connect agents into clinical pipelines (triage → diagnosis → medication review → scheduling).
- Backend: `Flask` REST API (in `backend/flask_app/`) exposes model inference, agent endpoints, and simulation control for demos.
- Explainability & Safety: `privacy_and_ethics/` and `models/explainability/` contain policies and artifacts required for healthcare-safe explanations.

Agent roles (short)
- Doctor: synthesizes patient context, proposes differential diagnoses, returns rationale and confidence; requests tests or medication reviews when needed.
- Nurse: triage, vitals monitoring, escalation rules; pre-processes patient inputs for downstream agents.
- Drug Checker: deterministic/rule-based interaction and contraindication checks against `data/drug_database.csv` (plus ML risk heuristics).
- Admin: scheduling, audit logging, and resource allocation; enforces workflow and records decisions for reproducibility.

How ML + LLM + Orchestration connect
1. A patient record (JSON) is POSTed to the Flask API (`/predict` or agent endpoints).
2. Lightweight ML models in `models/classical/` compute risk scores and features used by agents.
3. LangChain tools wrap ML services and rule-based utilities; prompts and templates live in `agents/langchain_tools/`.
4. LangGraph orchestrator runs the `treatment_workflow.graph.yaml`, invoking agents in defined order and collecting structured outputs.
5. Explainability modules (SHAP/LIME) produce explanations attached to predictions before any clinical recommendation is returned.

Research & paper mapping
- `docs/paper/04_System_Architecture.md` references `orchestration/` and `agents/` artifacts.
- `docs/paper/05_Methods.md` references `models/` training scripts and `models/explainability/` analyses.
- `experiments/` records reproducible runs; `notebooks/` demonstrate baseline experiments and simulations used in the paper.

# Final-year-prject-swaroop

Quick start (local)
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
./scripts/run_local.sh
# then POST a sample patient:
curl -sS -X POST http://127.0.0.1:5000/predict -H 'Content-Type: application/json' -d '{"patient": {"age": 72, "num_comorbidities": 2}}' | jq
```

Quick start (Docker Compose: Node API + Mongo + ML + LangGraph Agent Service)
```bash
# set Gemini key for agent service
export GEMINI_API_KEY="..."
docker compose up
```

Quick start (Dashboard UI: Next.js + React)
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
# open http://127.0.0.1:3001
```

Frontend integration notes (how data is displayed)
- Core REST APIs return JSON with a stable `{ data: ... }` wrapper.
- Real-time alerts (vitals/drug/high-risk) are streamed via SSE:
  - endpoint: `GET /api/events/stream?token=<JWT>`
  - events: `vitals.stream`, `high_risk_alert`, `drug_alert`
- Doctor workflow evaluation:
  - `POST /api/agents/doctor/evaluate`
  - returns the existing doctor output plus `workflow` (LangGraph + Gemini summary) when the agent service is reachable.
 - Dashboard implementation lives at `frontend/app/dashboard/page.tsx` and consumes:
   - `GET /api/ehr/patients`
   - `GET /api/vitals/records?patientId=...`
   - `GET /api/lab/reports?patientId=...`
   - `POST /api/pharmacy/prescription/check`
   - `POST /api/agents/doctor/evaluate`
   - `GET /api/events/stream?token=...` (SSE)

Vertex AI readiness notes
- Keep model-serving code isolated in `backend/flask_app/services/` (or a separate predictor module) to simplify containerization and Vertex custom container deployment.
- `deployment/vertex_ai/` contains starter deploy scripts and YAML examples for Vertex endpoints.

Ethics & explainability
- See `privacy_and_ethics/` for threat model, data handling and explainability policy.
- Attach SHAP summary plots and textual explanation templates to agent responses in demos to satisfy healthcare-safety reviewer concerns.

Repository map (high-level)
- `data/` — provenance, synthetic data generator, dataset descriptions.
- `models/` — training, evaluation, explainability artifacts.
- `agents/` — agent specs, LangChain tools, prompt templates.
- `orchestration/` — LangGraph graphs and pipelines.
- `backend/` — Flask REST APIs and services.
- `deployment/` — Docker, Vertex AI configs, infra examples.
- `docs/` — paper sections, figures, slides for viva.

If you want, I can now:
- scaffold LangChain tool adapters for one agent (Doctor), or
- scaffold a LangGraph orchestrator runner that executes the `treatment_workflow.graph.yaml`, or
- create the detailed paper draft in `docs/paper/*` from the structure above.
