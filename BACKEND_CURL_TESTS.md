# Backend Curl Test Guide

## 1) Start backend services

```bash
# terminal 1 (Node API)
npm install
npm run dev
```

Optional dependency services (recommended for full agent behavior):

```bash
# terminal 2 (ML service)
pip install -r python-ml-service/requirements.txt
uvicorn python-ml-service.main:app --host 127.0.0.1 --port 5000

# terminal 3 (LangGraph agent service)
pip install -r python-agent-service/requirements.txt
export GEMINI_API_KEY="your_key"
uvicorn python-agent-service.main:app --host 127.0.0.1 --port 7000
```

## 2) Seed sample data

```bash
npm run seed
```

## 3) Create auth token

```bash
TOKEN=$(npm run token -- --role admin | tail -n 1)
echo "$TOKEN"
```

## 4) Health checks

```bash
curl -s http://127.0.0.1:3000/health | jq

curl -s -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:3000/api/agents/health | jq
```

Clinical decision audit feed:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:3000/api/agents/decisions?limit=10" | jq
```

Use cursor pagination (`paging.nextCursor` from previous response):

```bash
CURSOR="<paste_nextCursor_here>"
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:3000/api/agents/decisions?limit=10&cursor=$CURSOR" | jq
```

## 5) EHR APIs

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:3000/api/ehr/patients | jq
```

```bash
PATIENT_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:3000/api/ehr/patients | jq -r '.data[0]._id')
echo "$PATIENT_ID"
```

FHIR export:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:3000/api/ehr/patients/$PATIENT_ID/fhir" | jq
```

## 6) Lab APIs

Create regular lab report:

```bash
curl -s -X POST http://127.0.0.1:3000/api/lab/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT_ID\",
    \"reportType\": \"BMP\",
    \"summary\": \"Electrolytes within acceptable range.\",
    \"values\": {\"sodium\": 139, \"potassium\": 4.6}
  }" | jq
```

Parse HL7 message:

```bash
curl -s -X POST http://127.0.0.1:3000/api/lab/hl7/parse \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message":"MSH|^~\\&|LAB|HOSP|EHR|HOSP|202603061200||ORU^R01|MSG1|P|2.3\rPID|1||MRN-1001||Patel^Aarav\rOBX|1|NM|hgb^Hemoglobin||11.4|g/dL\rNTE|1||Mild anemia suspected"
  }' | jq
```

Ingest HL7 into lab reports:

```bash
curl -s -X POST http://127.0.0.1:3000/api/lab/hl7/ingest \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType":"HL7_CBC",
    "message":"MSH|^~\\&|LAB|HOSP|EHR|HOSP|202603061200||ORU^R01|MSG2|P|2.3\rPID|1||MRN-1001||Patel^Aarav\rOBX|1|NM|hgb^Hemoglobin||11.4|g/dL\rOBX|2|NM|wbc^WBC||7.2|10*3/uL\rNTE|1||Mild anemia suspected"
  }' | jq
```

## 7) Vitals + Agent evaluation

Push abnormal vitals:

```bash
curl -s -X POST http://127.0.0.1:3000/api/vitals/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT_ID\",
    \"heartRateBpm\": 138,
    \"systolicMmHg\": 185,
    \"diastolicMmHg\": 121,
    \"spo2Pct\": 89,
    \"temperatureC\": 39.8
  }" | jq
```

Doctor evaluation:

```bash
curl -s -X POST http://127.0.0.1:3000/api/agents/doctor/evaluate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT_ID\",
    \"noteText\": \"Patient with low SpO2 and fever, monitor for deterioration.\",
    \"drugs\": [\"warfarin\", \"aspirin\"],
    \"vitals\": {
      \"heartRateBpm\": 138,
      \"systolicMmHg\": 185,
      \"diastolicMmHg\": 121,
      \"spo2Pct\": 89,
      \"temperatureC\": 39.8
    }
  }" | jq
```

Expected new fields in response:
- `riskLevel`
- `confidence`
- `escalationRecommended`
- `recommendations`
- `evidence`
- `chiefConsensus` (`finalPriority`, `finalAction`, `supervision`, `disagreement`, `rationale`)
- `safetyGate` (`uncertaintyBand`, `attendingApprovalRequired`, `mayProceedWithoutAttending`, `hardStop`, `reasons`)

## 8) SSE stream

```bash
curl -N "http://127.0.0.1:3000/api/events/stream?token=$TOKEN"
```

Watch for these simulation-related events:
- `simulation.status`
- `fhir.normalized`
- `lab.result.received`
- `pharmacy.order.placed`
- `clinical.note.received`

## 9) End-to-end clinical simulation

Start simulation run:

```bash
curl -s -X POST http://127.0.0.1:3000/api/simulations/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientCount": 4,
    "durationSeconds": 45,
    "updateIntervalMs": 3000,
    "severityProfile": { "highRiskPct": 50 },
    "seed": 42
  }' | jq
```

Capture simulation ID:

```bash
SIM_ID=$(curl -s -X POST http://127.0.0.1:3000/api/simulations/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patientCount":2,"durationSeconds":20,"updateIntervalMs":2000,"severityProfile":{"highRiskPct":50},"seed":7}' \
  | jq -r '.data.simulationId')
echo "$SIM_ID"
```

Poll run status:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:3000/api/simulations/$SIM_ID" | jq
```

Validation query for generated decision logs:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://127.0.0.1:3000/api/agents/decisions?limit=20" | jq
```

## 10) Direct ML service contract checks (optional)

```bash
curl -s -X POST http://127.0.0.1:5000/predict/risk \
  -H "Content-Type: application/json" \
  -d '{
    "patient": {
      "age": 72,
      "num_comorbidities": 2,
      "systolicMmHg": 168,
      "spo2Pct": 91,
      "temperatureC": 38.5
    }
  }' | jq
```

```bash
curl -s -X POST http://127.0.0.1:5000/analyze/notes \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Patient has chest pain, fever, and shortness of breath. Evaluate for sepsis."
  }' | jq
```

```bash
curl -s -X POST http://127.0.0.1:5000/qlearning/update \
  -H "Content-Type: application/json" \
  -d '{
    "state": "alert",
    "action": "escalate",
    "reward": 1,
    "next_state": "alert"
  }' | jq
```
