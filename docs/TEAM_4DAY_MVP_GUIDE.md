# SmartCare+ — Team execution guide (parallel, 4 days)

**Vision & day goals:** [`STARTUP_MVP_4DAY_PLAN.md`](./STARTUP_MVP_4DAY_PLAN.md)

| Person | Checklist |
|--------|-----------|
| **Sayali** | [`SAYALI_CHECKLIST.md`](./SAYALI_CHECKLIST.md) |
| **Mike** | [`MIKE_CHECKLIST.md`](./MIKE_CHECKLIST.md) |

**Repo:** `/Users/swaroopthakare/final year project/fp`

---

## Timeline

| Status | Days | Focus |
|--------|------|--------|
| Done | 1–2 | ML models, docker, seed, JWT login, `frontend2` auth |
| **Now** | 3 | Live vitals + real patient API |
| **Now** | 4 | Doctor evaluate + LangGraph + drug checker |
| **Now** | 5 | KPI dashboard + deploy (Railway/Vercel) |
| **Now** | 6 | Feedback retrain + stroke demo + video |

---

## How to work in parallel (no blocking)

```text
        Morning sync (10 min)
                 │
    ┌────────────┴────────────┐
    ▼                         ▼
  Mike                      Sayali
  branch: mike/dayN-*       branch: sayali/dayN-*
  src/ python-*             frontend2/
    │                         │
    └────────────┬────────────┘
                 ▼
        Mike posts API contract
        (sample JSON in PR description)
                 │
                 ▼
        Sayali integrates against main
                 │
                 ▼
        Evening: PR review → merge main
        Both: smoke test + git push
```

**Contract rule:** By **noon** each day, Mike posts sample responses (paste JSON in PR or team chat) for endpoints Sayali needs that day.

---

## Git workflow (mandatory — code pushed every day)

### Branch naming

| Person | Pattern | Example |
|--------|---------|---------|
| Mike | `mike/day{N}-{topic}` | `mike/day4-top-factors` |
| Sayali | `sayali/day{N}-{topic}` | `sayali/day4-risk-gauge` |

### Daily rhythm

1. `git checkout main && git pull`
2. `git checkout -b {your-branch}`
3. Work only in your folders (see below)
4. Before PR: tests/build green on your side
5. Open PR → other person reviews within 2 hours
6. Merge to `main` → both `git pull`
7. **Smoke test together** (5 min checklist per day in startup plan)
8. Optional: `git tag day-N` for milestones

### Who touches what

| Path | Mike | Sayali |
|------|:----:|:------:|
| `frontend2/` | — | yes |
| `src/` | yes | — |
| `python-ml-service/` | yes | — |
| `python-agent-service/` | yes | — |
| `models/` | yes | — |
| `docs/DEMO_SCRIPT.md` | help | lead |
| `docs/*.md` (plans) | both | both |

### Commit messages (copy-paste)

| Day | Mike | Sayali |
|-----|------|--------|
| 3 | `feat(api): auto-start vitals simulation on boot + EHR projections` | `feat(frontend2): live patients API + SSE vitals with pulse animation` |
| 4 | `feat(agents): topFactors, langgraph node timing, tPA drug rules` | `feat(frontend2): risk gauge, agent timeline, drug checker UI` |
| 5 | `build: dockerfiles + production deploy config` | `feat(frontend2): startup KPI dashboard + login tagline` |
| 6 | `feat(ml): feedback loop, retrain endpoint, stroke scenario` | `feat(demo): outcome buttons, retrain UI, stroke runner, demo script` |

**Release tag (Day 6):** `v1.0-mvp`

---

## Shared MVP done checklist (Day 6 evening)

- [ ] Pitch memorized (40-second multi-agent OS)
- [ ] Login tagline live
- [ ] 10s idle → vitals change
- [ ] Evaluate → gauge + explainability tooltip
- [ ] tPA → contraindication → 4-node timeline
- [ ] Public HTTPS URL **or** ngrok documented
- [ ] Feedback → retrain → AUC improves on screen
- [ ] Stroke demo ~40s automated
- [ ] `docs/DEMO_SCRIPT.md` + 90s backup video
- [ ] `npm test` green
- [ ] `git tag v1.0-mvp` pushed

---

## Daily smoke test (both run after merge)

### After Day 3

```bash
docker compose up -d
# Open http://localhost:3001 — wait 10s — vitals move
```

### After Day 4

```bash
# Login → Aarav → Evaluate → Check tPA → see timeline
```

### After Day 5

```bash
# Open production URL /login OR ngrok URL from README
```

### After Day 6

```bash
npm test
# Admin → Run Stroke Demo → Retrain → AUC delta
```

---

## Communication

- **Blockers > 1 hour:** switch to other person’s sub-task; message immediately
- **API changes:** backward-compatible or coordinate same-day merge
- **Secrets:** `.env` only — never commit `GEMINI_API_KEY`, `JWT_SECRET`, Atlas URI

---

## Quick reference

| Service | Local |
|---------|-------|
| Web | http://localhost:3001 |
| API | http://localhost:3000 |
| ML | http://localhost:5000 |
| Agent | http://localhost:7000 |

**Demo password:** `demo1234`

---

*Student plan archive: [`../MVP_PLAN.md`](../MVP_PLAN.md) (12-day version). Active sprint: this folder + `STARTUP_MVP_4DAY_PLAN.md`.*
