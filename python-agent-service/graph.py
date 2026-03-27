from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Literal, Optional, TypedDict

from langgraph.graph import StateGraph, END


class WorkflowState(TypedDict, total=False):
    patient_id: str
    vitals: Dict[str, Any]
    drugs: List[str]
    note_text: str
    risk_score: float
    recommended_action: str
    interactions: List[Dict[str, Any]]
    llm_summary: str
    audit: List[Dict[str, Any]]


@dataclass
class Deps:
    llm: Any


def build_graph(deps: Deps):
    def nurse_triage(state: WorkflowState) -> WorkflowState:
        vitals = state.get("vitals") or {}
        spo2 = float(vitals.get("spo2Pct", 100))
        hr = float(vitals.get("heartRateBpm", 70))
        sys = float(vitals.get("systolicMmHg", 120))
        temp = float(vitals.get("temperatureC", 36.7))

        flags = []
        if spo2 < 92:
            flags.append("Low SpO2")
        if hr >= 130:
            flags.append("Tachycardia")
        if sys >= 180:
            flags.append("Severe hypertension")
        if temp >= 39.5:
            flags.append("High fever")

        audit = state.get("audit") or []
        audit.append({"agent": "nurse", "step": "triage", "flags": flags})

        return {"audit": audit}

    def doctor_assess(state: WorkflowState) -> WorkflowState:
        # Node passes risk_score optionally; keep stable output.
        risk = float(state.get("risk_score") or 0.0)
        recommended = "admit" if risk >= 0.8 else "observe" if risk >= 0.5 else "observe"

        audit = state.get("audit") or []
        audit.append({"agent": "doctor", "step": "assess", "risk_score": risk, "recommended_action": recommended})
        return {"recommended_action": recommended, "audit": audit}

    def drug_check(state: WorkflowState) -> WorkflowState:
        drugs = [d.strip().lower() for d in (state.get("drugs") or []) if d.strip()]
        interactions: List[Dict[str, Any]] = []
        pairs = {tuple(sorted([a, b])) for a in drugs for b in drugs if a != b}
        if ("warfarin", "aspirin") in pairs:
            interactions.append(
                {"a": "warfarin", "b": "aspirin", "severity": "high", "note": "Increased bleeding risk."}
            )

        audit = state.get("audit") or []
        audit.append({"agent": "drugchecker", "step": "check", "interaction_count": len(interactions)})
        return {"interactions": interactions, "audit": audit}

    def llm_summarize(state: WorkflowState) -> WorkflowState:
        note = state.get("note_text") or ""
        risk = state.get("risk_score")
        action = state.get("recommended_action")
        interactions = state.get("interactions") or []

        prompt = (
            "You are a clinical workflow assistant. Produce a concise, structured summary for a doctor dashboard.\n"
            f"Risk score: {risk}\n"
            f"Recommended action: {action}\n"
            f"Drug interactions: {interactions}\n"
            f"Clinical note: {note}\n"
            "Return 5-8 lines max."
        )

        msg = deps.llm.invoke(prompt)
        text = getattr(msg, "content", None) or str(msg)

        audit = state.get("audit") or []
        audit.append({"agent": "doctor", "step": "llm_summary"})
        return {"llm_summary": text, "audit": audit}

    graph = StateGraph(WorkflowState)
    graph.add_node("nurse_triage", nurse_triage)
    graph.add_node("doctor_assess", doctor_assess)
    graph.add_node("drug_check", drug_check)
    graph.add_node("llm_summarize", llm_summarize)

    graph.set_entry_point("nurse_triage")
    graph.add_edge("nurse_triage", "doctor_assess")
    graph.add_edge("doctor_assess", "drug_check")
    graph.add_edge("drug_check", "llm_summarize")
    graph.add_edge("llm_summarize", END)

    return graph.compile()

