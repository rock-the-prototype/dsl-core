// src/mod.ts
export type { FileValidation, StatementValidation } from "./api/public_api.ts";
export { validateFile, validatePath, validateText } from "./api/public_api.ts";
export { generateReport } from "./api/public_api.ts";
export type { DslCoreReport } from "./report/buildReport.ts";
