# SmartCare+ — From Student Project to Startup MVP in 4 Days

**Days 1–2:** Done (repo, ML models, auth, login).  
**Days 3–6:** This document — execute in parallel, push to git every night.

**Execution checklists:** [Sayali](./SAYALI_CHECKLIST.md) · [Mike](./MIKE_CHECKLIST.md) · [Team guide](./TEAM_4DAY_MVP_GUIDE.md)

---

## The one-paragraph pitch (anchor everything)

> **SmartCare+** is a real-time AI operating system for hospital clinical teams. When a patient deteriorates, five specialised AI agents — triage, diagnosis, drug safety, cross-specialty routing, and treatment planning — fire in sequence within **40 seconds**, surface a risk score with explainability, block dangerous drug interactions, and generate an auditable clinical summary. Every decision is logged immutably. The model improves itself from outcome feedback. No hospital today connects these dots in real time.

Use this in slides, login tagline, and the first 10 seconds of the demo.

---

## Startup quality vs student quality

| Student quality | Startup quality (what judges expect) |
|-----------------|--------------------------------------|
| Long CRUD walkthrough | **3-minute demo** — something moving in the first 10 seconds |
| Generic dashboard | **Visual trust** — premium clinical UI (dark KPIs, clear hierarchy) |
| “Future work: retraining” | **Live AUC delta** after feedback — show the model learning |

**Three enhancements (2–3 hours total, high impact):**

1. **Explainability tooltip** on every risk score — hover shows “Systolic BP (188) → 34%, SpO2 (88) → 28%, Age (72) → 19%”.
2. **Model Performance card** (admin) — current AUC, training date, feedback count, tiny sparkline.
3. **Login tagline:** *“AI-Powered Clinical Intelligence. 40-second emergency response. Every decision explained.”*

---

## What’s already shipped (Days 1–2)

- [x] Clean repo: Node API + 2 Python services + `frontend2` only
- [x] Trained `logistic.pkl` / `rf.pkl` (real scores, not fallback sigmoid)
- [x] Mongo seed: 5 patients, Aarav stroke vitals progression, demo users
- [x] JWT cookie auth + role login (`/login`)

---

## 4-day calendar (Days 3–6)

| Day | Theme | Judge should feel |
|-----|--------|-------------------|
| **3** | System is alive | Vitals ticking before anyone clicks |
| **4** | The “wow” | Risk gauge + LangGraph timeline + tPA story |
| **5** | This is real | Public HTTPS URL + premium dashboard |
| **6** | The win | Feedback retrain + stroke demo + backup video |

**Out of scope unless Days 3–5 finish early:** full reports module (original Day 7), heavy admin tables (original Day 8). Do **not** sacrifice feedback loop or stroke scenario for these.

---

## Day 3 — Patient chart + real-time vitals (“System is alive”)

**Goal:** Open the app → within 10 seconds vitals change twice with no clicks.

### Mike (backend)

- Auto-start simulation on API boot (`startup.service.ts` → `simulationService.start()` for seeded patients, 3s interval).
- Verify `GET /api/ehr/patients` and `GET /api/ehr/patients/:id` return Mongo data (shape Sayali can map).
- Confirm `GET /api/events/stream` emits vitals for Aarav without manual `POST /simulations/start`.
- Vitals rules: BP > 180 or SpO2 < 90 → `vitalsAnomaly` / high-risk on SSE.

### Sayali (frontend)

- `usePatients()` + `usePatient()` — remove mock `patients` from `hospital-data.ts`.
- Skeleton loaders on list/detail.
- `useEventStream` → vitals tile updates live.
- CSS pulse ring on heart rate (3 lines, no library).

### Acceptance

- [ ] Open app, wait 10s, Aarav vitals change ≥ 2 times.
- [ ] Patient list = Mongo count; click Aarav → BP ~188, SpO2 ~88.

### Git (end of day)

- Mike: `feat(api): auto-start vitals simulation on boot + EHR projections`
- Sayali: `feat(frontend2): live patients API + SSE vitals with pulse animation`

---

## Day 4 — AI brain: evaluate + LangGraph + drug checker (“Wow”)

**Goal:** 4-click story: evaluate → high risk → check tPA → contraindication → LangGraph summary.

### Mike (backend + Python)

- ML: `topFactors` in `/predict/risk` (top 3 by `coef * input_value`).
- Doctor evaluate: return `topFactors`, Q-learning action, audit log entry.
- LangGraph: each node adds `duration_ms` + `output` to state; API returns `nodes: [{ name, duration_ms, output }, ...]`.
- Drug rules: tPA + hypertension → high severity (exact demo copy).
- Gemini fallback: same JSON shape; never 500 on demo path.

### Sayali (frontend)

- Risk gauge (semicircle SVG, animates 0 → score).
- “Thinking…” state ≥ 1.5s even if API is fast.
- Top factors bar chart (recharts) + **hover tooltip** on risk score.
- LangGraph timeline: 4 cards, horizontal line, sequential highlight.
- Drug checker panel: red/yellow/green results; “Check tPA” from doctor flow.

### Acceptance

- [ ] Evaluate Aarav → gauge + factors; model = `logistic_regression` in logs.
- [ ] tPA → red contraindication; timeline shows 4 nodes with timings.

### Git (end of day)

- Mike: `feat(agents): topFactors, langgraph node timing, tPA drug rules`
- Sayali: `feat(frontend2): risk gauge, agent timeline, drug checker UI`

---

## Day 5 — Dashboard + deployment (“This is real”)

**Goal:** Public HTTPS login URL + 6 KPI tiles that look investor-ready.

### Mike (infra)

- `Dockerfile.api`, `Dockerfile.web`, Python Dockerfiles, `.dockerignore`.
- MongoDB Atlas free tier; env vars on host.
- Deploy: **Railway or Render** (API + Python) + **Vercel** (`frontend2`). Azure optional later — don’t block URL.
- **Hard rule:** If not live by EOD → `ngrok` tunnel for demo; don’t burn Day 6 on infra.

### Sayali (frontend)

- KPI row from `GET /api/admin/metrics`: critical patients, active alerts, drug conflicts, avg response time, model AUC (static from training log OK today), ICU beds.
- Dark premium layout for KPI strip (ZORD-style: large numbers, accent lines).
- Mobile responsiveness pass.
- Login tagline update (see pitch section).

### Acceptance

- [ ] Public URL loads `/login` over HTTPS (or documented ngrok fallback).
- [ ] 6 KPIs visible on dashboard.

### Git (end of day)

- Mike: `build: dockerfiles + railway/render deploy config`
- Sayali: `feat(frontend2): startup KPI dashboard + login tagline`

---

## Day 6 — Closed loop + demo + video (“Win”)

**Goal:** Show model improving live; 40s stroke demo; backup video; judge Q&A doc.

### Mike (backend)

- `POST /api/feedback` → append `feedback.csv`.
- `POST /api/admin/retrain` → run trainer with `--include-feedback`; return before/after AUC.
- `stroke.scenario.ts` + `POST /api/simulations/run-scenario` (~40s chain).
- Admin API: current AUC, feedback count for Model Performance card.

### Sayali (frontend)

- Outcome buttons: Recovered / Deteriorated / Partial → call feedback API.
- Admin “Retrain model” button + AUC before/after display + sparkline.
- “Run Stroke Demo” button (admin) — audit log lights up step-by-step.
- Record **90s** backup video (YouTube unlisted).
- Write `docs/DEMO_SCRIPT.md` + prep answer for *“How is this different from Epic?”*

> **Epic records what happened. SmartCare+ predicts what’s about to happen and coordinates the response before it’s too late — with an auditable AI chain that improves over time.**

### Acceptance

- [ ] Retrain shows AUC delta (e.g. 0.87 → 0.89).
- [ ] Stroke demo 3× without errors; audit shows full chain.
- [ ] `npm test` green; tag `v1.0-mvp`.

### Git (end of day)

- Mike: `feat(ml): feedback loop + retrain endpoint + stroke scenario`
- Sayali: `feat(demo): outcome buttons, retrain UI, stroke runner, demo script`
- Either: `git tag v1.0-mvp && git push --tags`

---

## Risk management

| Risk | Mitigation |
|------|------------|
| Gemini quota / latency | Fallback summary + **“AI stub”** badge only; layout identical |
| Deploy slips | **ngrok** by end of Day 5; demo local is OK |
| Feature creep | No reports/admin tables unless Days 3–5 done early |

---

## Parallel work rules

1. **Morning:** 10-min sync — what merges today, API contracts frozen by noon.
2. **Branches:** `mike/day3-*`, `sayali/day3-*` — no direct pushes to `main` without review.
3. **Evening:** Both merge; run `docker compose up` + 2-min smoke test together.
4. **Folders:** Sayali → `frontend2/` only. Mike → `src/`, `python-*-service/`, `models/`, `infra/`, `docs/` (API parts).

---

## Ports (local)

| Service | URL |
|---------|-----|
| Web | http://localhost:3001 |
| API | http://localhost:3000 |
| ML | http://localhost:5000 |
| Agent | http://localhost:7000 |

Demo logins: `demo1234` — `dr.rao@smartcare.dev` / `nurse.priya@smartcare.dev` / `admin@smartcare.dev`
