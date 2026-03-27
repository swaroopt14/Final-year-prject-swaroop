export type Hl7Message = {
  segments: Array<{ name: string; fields: string[] }>;
};

export function parseHl7(message: string): Hl7Message {
  const segments = message
    .split(/\r?\n|\r/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const fields = line.split("|");
      return { name: fields[0] ?? "UNK", fields };
    });

  return { segments };
}

