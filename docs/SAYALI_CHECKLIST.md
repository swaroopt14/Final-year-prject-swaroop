# Sayali — 4-Day Startup MVP Checklist (Days 3–6)

**Repo:** `/Users/swaroopthakare/final year project/fp`  
**You own:** `frontend2/` only (do not edit `src/` or Python — ask Mike)

Master plan: [`STARTUP_MVP_4DAY_PLAN.md`](./STARTUP_MVP_4DAY_PLAN.md) · Mike: [`MIKE_CHECKLIST.md`](./MIKE_CHECKLIST.md)

---

## Git rules (every day)

- [ ] Morning: `git pull origin main`
- [ ] Work on branch: `sayali/day{N}-{short-name}` (e.g. `sayali/day3-sse-vitals`)
- [ ] Evening: PR → Mike reviews → merge to `main`
- [ ] After merge: pull `main`; run `cd frontend2 && npm run build`
- [ ] Commit message format below per day

---

## Setup (once)

- [ ] `cp .env.example .env` — `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000`
- [ ] `cd frontend2 && npm install`
- [ ] `docker compose up -d` (or Mike starts stack)
- [ ] Login: http://localhost:3001/login — Doctor tile → dashboard
- [ ] Password: `demo1234` for all roles

| Role | Email |
|------|-------|
| Doctor | dr.rao@smartcare.dev |
| Nurse | nurse.priya@smartcare.dev |
| Admin | admin@smartcare.dev |

---

## Day 3 — Real patients + live vitals (“System is alive”)

### Code

- [ ] `frontend2/hooks/usePatients.ts` → `GET /api/ehr/patients` (`credentials: 'include'`)
- [ ] `frontend2/hooks/usePatient.ts` → patient + vitals + labs
- [ ] Remove exported `patients` array from `frontend2/lib/hospital-data.ts`
- [ ] `workbench.tsx` — use hooks; skeleton while loading
- [ ] `frontend2/hooks/useEventStream.ts` → `/api/events/stream` with credentials
- [ ] Vitals tile subscribes to stream; numbers update in place
- [ ] CSS pulse ring on heart rate (3-line animation, no extra deps)
- [ ] Alerts strip shows anomaly events (red row + timestamp)

### Test (with Mike’s auto-sim)

- [ ] Open app → **wait 10s without clicking** → Aarav vitals change ≥ 2 times
- [ ] Click Aarav → BP ~188, SpO2 ~88 from API
- [ ] Network tab: no mock patient JSON from `hospital-data.ts`

### Git (required EOD)

- [ ] Branch merged to `main`
- [ ] Commit: `feat(frontend2): live patients API + SSE vitals with pulse animation`

---

## Day 4 — Risk gauge + timeline + drug checker (“Wow”)

### Code

- [ ] `frontend2/hooks/useDoctorEvaluation.ts`
- [ ] `frontend2/components/hospital-os/doctor-panel.tsx`
  - [ ] Semicircle SVG risk gauge (animate 0 → score)
  - [ ] “Thinking…” animation **minimum 1.5s**
  - [ ] Recharts bar chart — top 3 factors
  - [ ] **Tooltip on risk score** — factor % breakdown (explainability)
- [ ] `frontend2/components/hospital-os/agent-timeline.tsx`
  - [ ] 4 horizontal cards + connecting line
  - [ ] Sequential highlight using `nodes[]` from API
  - [ ] “AI stub” badge when summary is fallback
- [ ] `frontend2/components/hospital-os/drug-checker.tsx`
  - [ ] “Check tPA” flow from doctor panel
  - [ ] Red / yellow / green result states
- [ ] Wire 4-click demo path: evaluate → high risk → tPA → timeline summary

### Test

- [ ] Evaluate Aarav → gauge + bars visible
- [ ] tPA → red contraindication copy visible
- [ ] Timeline shows 4 steps with timings under 5s total UX

### Git (required EOD)

- [ ] Branch merged to `main`
- [ ] Commit: `feat(frontend2): risk gauge, agent timeline, drug checker UI`

---

## Day 5 — KPI dashboard + polish + login (“This is real”)

### Code

- [ ] KPI strip from `GET /api/admin/metrics` (6 tiles):
  - [ ] Critical patients
  - [ ] Active alerts
  - [ ] Drug conflicts
  - [ ] Avg response time
  - [ ] Model AUC (static number OK until Day 6)
  - [ ] ICU beds available
- [ ] Dark premium styling — large numbers, accent borders (clinical/trustworthy)
- [ ] Login page tagline: *“AI-Powered Clinical Intelligence. 40-second emergency response. Every decision explained.”*
- [ ] Mobile layout pass (375px width — no broken sidebar)
- [ ] Point `NEXT_PUBLIC_API_BASE_URL` to Mike’s production URL when ready

### Test

- [ ] Dashboard loads KPIs from production/staging API
- [ ] Login screen readable on phone

### Git (required EOD)

- [ ] Branch merged to `main`
- [ ] Commit: `feat(frontend2): startup KPI dashboard + login tagline`

---

## Day 6 — Feedback UI + stroke demo + video (“Win”)

### Code

- [ ] Outcome buttons on treatment panel: **Recovered** / **Deteriorated** / **Partial**
  - [ ] `POST /api/feedback` on click
- [ ] Admin: **Model Performance** card — AUC, training date, feedback count, sparkline
- [ ] Admin: **Retrain model** button → show before/after AUC from Mike’s API
- [ ] `frontend2/components/hospital-os/demo-runner.tsx` — “Run Stroke Demo” (admin only)
- [ ] Audit log highlights steps as scenario events arrive (SSE or poll)
- [ ] Write `docs/DEMO_SCRIPT.md` — exact clicks + 5 judge Q&A (with Mike)

### Video & report

- [ ] Record **90s** screen capture + voiceover (unlisted YouTube)
- [ ] Screenshots: dashboard, live vitals, evaluate, timeline, drug alert, retrain AUC, audit
- [ ] Paste video link in report draft

### Test

- [ ] Run stroke demo 3× back-to-back — no crash
- [ ] Retrain button shows AUC change during demo
- [ ] Full demo alone without Mike prompting

### Git (required EOD)

- [ ] Branch merged to `main`
- [ ] Commit: `feat(demo): outcome buttons, retrain UI, stroke runner, demo script`

---

## Final Sayali sign-off

- [ ] Days 3–6 commits visible on `main`
- [ ] No edits outside `frontend2/` (except `docs/DEMO_SCRIPT.md`)
- [ ] Epic vs SmartCare+ answer memorized
- [ ] Backup video URL shared with team

---

## If stuck — ping Mike

| Issue | Need from Mike |
|-------|----------------|
| 401 on API | Seed / CORS / cookie |
| Empty patients | `npm run seed` |
| SSE silent | Event names + auto-sim running |
| Evaluate 500 | ML + agent logs |
| Metrics 404 | `/api/admin/metrics` deployed |
