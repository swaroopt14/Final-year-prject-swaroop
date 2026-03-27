export type DrugInteraction = {
  a: string;
  b: string;
  severity: "low" | "medium" | "high";
  note: string;
};

const RULES: DrugInteraction[] = [
  { a: "warfarin", b: "aspirin", severity: "high", note: "Increased bleeding risk." },
  { a: "warfarin", b: "ibuprofen", severity: "high", note: "Increased bleeding risk." },
  { a: "metformin", b: "contrast_dye", severity: "high", note: "Risk of lactic acidosis; hold metformin." },
  { a: "lisinopril", b: "spironolactone", severity: "medium", note: "Risk of hyperkalemia." },
  { a: "clopidogrel", b: "omeprazole", severity: "medium", note: "Reduced antiplatelet effect." }
];

export function findInteractions(drugs: string[]) {
  const normalized = drugs.map((d) => d.trim().toLowerCase()).filter(Boolean);
  const found: DrugInteraction[] = [];

  for (const rule of RULES) {
    const hasA = normalized.includes(rule.a);
    const hasB = normalized.includes(rule.b);
    if (hasA && hasB) found.push(rule);
  }

  return found;
}

