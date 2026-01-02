// src/mod.ts
export type { StatementValidation, FileValidation } from "./api/public_api.ts";
export { validateText, validateFile, validatePath } from "./api/public_api.ts";
export { generateReport } from "./api/public_api.ts";
export type { DslCoreReport } from "./report/buildReport.ts";
