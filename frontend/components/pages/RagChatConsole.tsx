"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

type Msg = {
  id: string;
  role: "user" | "agent";
  at: number;
  author: string;
  text: string;
};

function formatTime(at: number) {
  const d = new Date(at);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function agentReply(userText: string) {
  return [
    "I can help summarize the patient context and retrieve relevant protocols (RAG).",
    "",
    "What I would do next (design):",
    "- Retrieve: hospital SOP + guideline snippets relevant to the query",
    "- Extract: contraindications, missing data, and uncertainty",
    "- Produce: an explainable bundle (recommendations + evidence + audit metadata)",
    "",
    "Your input:",
    "```",
    userText.trim().slice(0, 600),
    "```"
  ].join("\n");
}

function renderText(text: string) {
  // Minimal markdown-ish rendering: code fences and line breaks.
  const parts = text.split("```");
  return (
    <div className="space-y-2">
      {parts.map((p, idx) => {
        const isCode = idx % 2 === 1;
        if (isCode) {
          return (
            <pre key={idx} className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-800">
              <code>{p}</code>
            </pre>
          );
        }
        return (
          <div key={idx} className="whitespace-pre-wrap text-sm text-slate-800">
            {p}
          </div>
        );
      })}
    </div>
  );
}

export function RagChatConsole({ title = "RAG Chat Console" }: { title?: string }) {
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      id: uid(),
      role: "agent",
      at: Date.now() - 60_000,
      author: "Doctor Agent",
      text:
        "Ask a clinical question (e.g., “Summarize sepsis risk and recommended next steps”).\n\nThis UI mirrors a ChatGPT-style console; backend RAG wiring comes next."
    }
  ]);

  const canSend = useMemo(() => draft.trim().length > 0 && !typing, [draft, typing]);

  async function send() {
    if (!canSend) return;
    const userText = draft;
    setDraft("");
    setMsgs((m) => [{ id: uid(), role: "user", at: Date.now(), author: "Clinician", text: userText }, ...m]);
    setTyping(true);
    // Simulate streaming delay; swap with real RAG endpoint later.
    await new Promise((r) => setTimeout(r, 650));
    setMsgs((m) => [{ id: uid(), role: "agent", at: Date.now(), author: "Doctor Agent", text: agentReply(userText) }, ...m]);
    setTyping(false);
  }

  return (
    <Card>
      <CardHeader
        title={title}
        subtitle="Chat-style console for LLM/RAG outputs (designed for explainability + evidence)"
        right={
          <div className="flex items-center gap-2">
            <Badge tone="sky">RAG</Badge>
            <Badge tone="slate">Markdown</Badge>
            {typing ? <Badge tone="yellow">Typing…</Badge> : null}
          </div>
        }
      />
      <CardBody className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="max-h-[420px] overflow-y-auto p-4">
            <div className="flex flex-col-reverse gap-3">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={clsx(
                    "max-w-[900px] rounded-2xl border px-4 py-3 shadow-soft",
                    m.role === "user"
                      ? "ml-auto border-slate-200 bg-slate-50"
                      : "mr-auto border-slate-200 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold text-slate-700">{m.author}</div>
                    <div className="text-[11px] text-slate-500">{formatTime(m.at)}</div>
                  </div>
                  <div className="mt-2">{renderText(m.text)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask the agent… (include patient id, symptoms, vitals, meds)"
                  className="min-h-[92px]"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setMsgs((m) => m.slice(0, 1))} disabled={typing}>
                  Clear
                </Button>
                <Button variant="primary" onClick={send} disabled={!canSend}>
                  Send
                </Button>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Safety note: in production, responses must include citations, uncertainty, and policy checks.
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

