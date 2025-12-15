export interface ValidationError {
    ruleId: string;
    severity: "error" | "warning";
    field?: string;
    message: string;
}