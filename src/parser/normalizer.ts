// src/parser/normalizer.ts
// Normalization into a canonical form

export function normalizeInput(input: string): string {
  return input
    .replace(/\s+/g, " ") // remove double spaces
    .replace(/\s*,\s*/g, ", ") // normalize commas
    .replace(/\s*\.\s*$/, ".") // ensure single period
    .replace(/\b(as|i|when|then|must|must not)\b/gi, (m) =>
      m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()
    )
    .trim();
}
