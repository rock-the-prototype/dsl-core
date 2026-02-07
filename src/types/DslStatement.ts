/*
 * Copyright 2026 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

export interface DslStatement<TAtom> {
  source: {
    path?: string;
    raw: string;
    normalized?: string;
    locations?: Array<{ line: number; col: number; len?: number }>;
  };
  kind: "requirement" | "decision";        // später
  profileId?: string;                      // später
  atom?: TAtom;                            // canonical
  validation?: ValidationResult;
  error?: { name: string; message: string; code?: string };
}
