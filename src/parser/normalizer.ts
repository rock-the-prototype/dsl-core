/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/parser/normalizer.ts
// Normalization into a canonical form

export function normalizeInput(input: string): string {
  return input
    .replace(/\s+/g, " ") // collapse whitespace
    .replace(/\s*,\s*/g, ", ") // normalize commas
    .replace(/\s*\.\s*$/, ".") // ensure single period at end
    .replace(/\b(as)\s+(a|an|the)\s+/gi, "as ") // optional: strip articles after 'as'
    .replace(
      /\b(must not|must|as|i|we|when|if|whenever|then)\b/gi,
      (m) => m.toLowerCase(),
    )
    .replace(/\b(if|whenever)\b/g, "when") // optional: unify condition keywords
    .trim();
}
