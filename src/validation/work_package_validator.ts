import type { WorkPackageAtom } from "../types/WorkPackageAtom.ts";
import type { ValidationError } from "./types.ts";

export interface WorkPackageValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const ALLOWED_WORK_TYPES = new Set([
  "epic",
  "feature",
  "story",
  "task",
  "bug",
  "adr",
  "milestone",
  "spike",
  "chore",
]);

const ALLOWED_STATUSES = new Set([
  "draft",
  "ready",
  "in_progress",
  "blocked",
  "done",
  "accepted",
]);

const ALLOWED_PRIORITIES = new Set(["critical", "high", "medium", "low"]);
const ALLOWED_RELATION_TYPES = new Set([
  "relates_to",
  "depends_on",
  "blocks",
  "parent_of",
  "child_of",
]);

const ID_RE = /^[A-Za-z0-9_-]+$/;
const ESTIMATE_RE = /^[1-9][0-9]*(m|h|d|w)$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function validateWorkPackage(
  atom: WorkPackageAtom,
): WorkPackageValidationResult {
  const errors: ValidationError[] = [];

  if (!ID_RE.test(atom.id)) {
    errors.push({
      ruleId: "WP.WORK_PACKAGE.ID.001",
      severity: "error",
      field: "id",
      message:
        "A work package MUST define a stable identifier using only letters, numbers, underscores, and hyphens.",
    });
  }

  if (!ALLOWED_WORK_TYPES.has(atom.workType)) {
    errors.push({
      ruleId: "WP.WORK_PACKAGE.TYPE.001",
      severity: "error",
      field: "workType",
      message:
        "The workType MUST be one of the allowed technology-agnostic work package types.",
    });
  }

  if (
    !atom.title || atom.title.trim().length === 0 || atom.title.length > 120
  ) {
    errors.push({
      ruleId: "WP.WORK_PACKAGE.TITLE.001",
      severity: "error",
      field: "title",
      message:
        "A work package MUST have a non-empty title and MUST remain within the maximum configured length.",
    });
  }

  if (!ALLOWED_STATUSES.has(atom.status)) {
    errors.push({
      ruleId: "WP.WORK_PACKAGE.STATUS.001",
      severity: "error",
      field: "status",
      message: "The status MUST be one of the allowed lifecycle states.",
    });
  }

  if (!ALLOWED_PRIORITIES.has(atom.priority)) {
    errors.push({
      ruleId: "WP.WORK_PACKAGE.PRIORITY.001",
      severity: "error",
      field: "priority",
      message: "The priority MUST be one of the allowed priority classes.",
    });
  }

  for (const relation of atom.relations ?? []) {
    if (!ALLOWED_RELATION_TYPES.has(relation.type)) {
      errors.push({
        ruleId: "WP.WORK_PACKAGE.RELATION.001",
        severity: "error",
        field: "relations[].type",
        message:
          "Each relation type MUST be part of the canonical relation vocabulary.",
      });
    }
  }

  if (atom.dueDate !== undefined && !isValidIsoDate(atom.dueDate)) {
    errors.push({
      ruleId: "WP.WORK_PACKAGE.DATE.001",
      severity: "error",
      field: "dueDate",
      message:
        "If a due date is present, it MUST be expressed in ISO 8601 calendar date format (YYYY-MM-DD).",
    });
  }

  if (atom.estimate !== undefined && !ESTIMATE_RE.test(atom.estimate)) {
    errors.push({
      ruleId: "WP.WORK_PACKAGE.ESTIMATE.001",
      severity: "error",
      field: "estimate",
      message:
        "If an estimate is present, it MUST use a compact, deterministic duration token such as 30m, 4h, 2d, or 1w.",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
