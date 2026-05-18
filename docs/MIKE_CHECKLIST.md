# Mike — 4-Day Startup MVP Checklist (Days 3–6)

**Repo:** `/Users/swaroopthakare/final year project/fp`  
**You own:** `src/`, `python-ml-service/`, `python-agent-service/`, `models/`, Docker, deploy, `tests/`

Master plan: [`STARTUP_MVP_4DAY_PLAN.md`](./STARTUP_MVP_4DAY_PLAN.md) · Sayali: [`SAYALI_CHECKLIST.md`](./SAYALI_CHECKLIST.md)

---

## Git rules (every day)

- [ ] Morning: `git pull origin main`
- [ ] Work on branch: `mike/day{N}-{short-name}` (e.g. `mike/day3-auto-sim`)
- [ ] Before PR: `npm test` + `npm run build` pass
- [ ] Evening: PR → Sayali reviews → merge to `main`
- [ ] After merge: push `main`; message format below per day

---

## Setup (once)

- [ ] `docker compose up -d mongo ml-service agent-service api`
- [ ] `npm run seed` succeeds (Mongo running)
- [ ] `curl http://localhost:3000/health` → ok
- [ ] `curl http://localhost:5000/health` → ok
- [ ] `.env` has `GEMINI_API_KEY` (optional; fallback must work)

---

## Day 3 — Auto simulation + EHR + SSE (“System is alive”)

### Code

- [ ] Create `src/startup.service.ts` — on boot, start simulation for seeded patients (3s interval)
- [ ] Wire startup in `src/server.ts` after DB connect
- [ ] Verify `GET /api/ehr/patients` — document JSON shape for Sayali (Slack/doc comment)
- [ ] Verify `GET /api/ehr/patients/:id` includes latest vitals
- [ ] `POST /api/vitals/records` triggers SSE: vitals stream + anomaly if BP>180 or SpO2<90
- [ ] Document SSE event names for Sayali: `vitals.stream`, `high_risk_alert`, etc.

### Test

- [ ] Restart API → within 30s SSE shows vitals without manual simulation POST
- [ ] `curl -N http://localhost:3000/api/events/stream?token=...` shows events

### Git (required EOD)

- [ ] Branch merged to `main`
- [ ] Commit: `feat(api): auto-start vitals simulation on boot + EHR projections`

### Sayali unblocked when

- [ ] She can call `/api/ehr/patients` with cookie and get Aarav
- [ ] SSE streams without her calling `/simulations/start`

---

## Day 4 — topFactors + LangGraph timing + tPA rules (“Wow”)

### Code — ML (`python-ml-service/main.py`)

- [ ] `/predict/risk` returns `top_factors: [{ name, weight, contribution }]` top 3
- [ ] Rebuild/test: Aarav profile returns factors, not fallback model

### Code — Agent (`python-agent-service/graph.py`)

- [ ] Each node records `duration_ms` + human-readable `output` string in state
- [ ] Response includes `nodes: [{ name, duration_ms, output }, ...]`
- [ ] Fallback path returns same shape (stub summary)

### Code — Node API

- [ ] `POST /api/agents/doctor/evaluate` returns `risk`, `topFactors`, `qlearning`, `audit`
- [ ] Persist to decisions / workflow log collection
- [ ] `pharmacy/drug.rules.ts`: tPA + hypertension → high severity + demo message
- [ ] LangGraph client forwards `nodes` array to frontend response

### Test

- [ ] Evaluate Aarav → `topFactors.length >= 3`
- [ ] Pharmacy check tPA → contraindication in JSON
- [ ] Agent logs show 4 nodes with timings

### Git (required EOD)

- [ ] Branch merged to `main`
- [ ] Commit: `feat(agents): topFactors, langgraph node timing, tPA drug rules`

### Sayali unblocked when

- [ ] Sample evaluate JSON pasted in PR or Discord for her UI mocks

---

## Day 5 — Docker + deploy + admin metrics (“This is real”)

### Code

- [ ] `Dockerfile.api` (multi-stage Node)
- [ ] `Dockerfile.web` + `frontend2/next.config.mjs` → `output: 'standalone'`
- [ ] `python-ml-service/Dockerfile`, `python-agent-service/Dockerfile`
- [ ] `.dockerignore`
- [ ] `GET /api/admin/metrics` — 6 numbers Sayali needs (see plan)
- [ ] MongoDB Atlas URI in production env template

### Deploy

- [ ] MongoDB Atlas cluster + IP allowlist
- [ ] Railway/Render: api + ml + agent services
- [ ] Vercel: `frontend2` with `NEXT_PUBLIC_API_BASE_URL` = production API
- [ ] `CORS_ORIGIN` = Vercel URL
- [ ] **Fallback if stuck:** ngrok to local API documented in README

### Test

- [ ] `docker compose build` succeeds
- [ ] Public HTTPS `/login` loads OR ngrok URL written in `docs/DEMO_SCRIPT.md`

### Git (required EOD)

- [ ] Branch merged to `main`
- [ ] Commit: `build: dockerfiles + production deploy config`

### Sayali unblocked when

- [ ] Production API URL + metrics endpoint live for her KPI tiles

---

## Day 6 — Feedback + retrain + stroke scenario (“Win”)

### Code

- [ ] `POST /api/feedback { patientId, outcome, decisionId }` → append `data/feedback.csv`
- [ ] `POST /api/admin/retrain` → run `train.py --include-feedback` → return `{ auc_before, auc_after }`
- [ ] `src/modules/simulations/scenarios/stroke.scenario.ts`
- [ ] `POST /api/simulations/run-scenario { name: 'stroke', patientId }` (~40s)
- [ ] Admin endpoint: model AUC, feedback count, last trained date
- [ ] `tests/scenarios/stroke.test.ts` (login → evaluate → drug → scenario events)

### Test

- [ ] Run stroke scenario 3× — audit chain complete
- [ ] Retrain returns higher or equal AUC with sample feedback rows
- [ ] `npm test` all green

### Git (required EOD)

- [ ] Branch merged to `main`
- [ ] Commit: `feat(ml): feedback loop, retrain endpoint, stroke scenario`
- [ ] Tag: `git tag v1.0-mvp && git push origin v1.0-mvp`

### Demo support

- [ ] Pair with Sayali on full `DEMO_SCRIPT.md` dry-run
- [ ] Confirm backup video URL works

---

## Final Mike sign-off

- [ ] All Day 3–6 commits on `main`
- [ ] No secrets in git
- [ ] ML service uses `.pkl` not fallback in demo
- [ ] Epic vs SmartCare+ answer memorized with Sayali
