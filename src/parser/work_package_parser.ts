import type {
  WorkPackageAtom,
  WorkPackageRelation,
} from "../types/WorkPackageAtom.ts";

const HEADER_RE = /^WP\s+(?<id>[A-Za-z0-9_-]+)$/;
const TYPE_RE = /^TYPE\s+(?<workType>[A-Za-z0-9_-]+)$/;
const TITLE_RE = /^TITLE\s+(?<title>.+)$/;
const STATUS_RE = /^STATUS\s+(?<status>[A-Za-z0-9_-]+)$/;
const PRIORITY_RE = /^PRIORITY\s+(?<priority>[A-Za-z0-9_-]+)$/;
const OWNER_RE = /^OWNER\s+(?<owner>[A-Za-z0-9._-]+)$/;
const PARENT_RE = /^PARENT\s+(?<parent>[A-Za-z0-9_-]+)$/;
const REL_RE = /^REL\s+(?<type>[A-Za-z_]+)\s+(?<target>[A-Za-z0-9_-]+)$/;
const LABEL_RE = /^LABEL\s+(?<label>[A-Za-z0-9._-]+)$/;
const ESTIMATE_RE = /^ESTIMATE\s+(?<estimate>[A-Za-z0-9._-]+)$/;
const DUE_RE = /^DUE\s+(?<dueDate>\d{4}-\d{2}-\d{2})$/;
const DESC_RE = /^DESC\s+(?<description>.+)$/;

function normalizeLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function ensureMatch(
  line: string,
  regex: RegExp,
  message: string,
): Record<string, string> {
  const match = line.match(regex);
  if (!match?.groups) {
    throw new Error(message);
  }
  return match.groups as Record<string, string>;
}

function toRelation(line: string): WorkPackageRelation {
  const groups = ensureMatch(
    line,
    REL_RE,
    `Invalid relation line: ${line}`,
  );

  return {
    type: groups.type.toLowerCase(),
    target: groups.target,
  };
}

export function parseWorkPackage(input: string): WorkPackageAtom {
  const lines = normalizeLines(input);

  if (lines.length === 0) {
    throw new Error("Work package input is empty.");
  }

  const header = ensureMatch(
    lines[0],
    HEADER_RE,
    "Invalid work package header. Expected 'WP <id>'.",
  );

  const partial: Partial<WorkPackageAtom> = {
    id: header.id,
    relations: [],
    labels: [],
    extensions: {},
  };

  for (const line of lines.slice(1)) {
    if (TYPE_RE.test(line)) {
      partial.workType = ensureMatch(
        line,
        TYPE_RE,
        `Invalid TYPE line: ${line}`,
      ).workType.toLowerCase();
      continue;
    }

    if (TITLE_RE.test(line)) {
      partial.title = ensureMatch(
        line,
        TITLE_RE,
        `Invalid TITLE line: ${line}`,
      ).title.trim();
      continue;
    }

    if (STATUS_RE.test(line)) {
      partial.status = ensureMatch(
        line,
        STATUS_RE,
        `Invalid STATUS line: ${line}`,
      ).status.toLowerCase();
      continue;
    }

    if (PRIORITY_RE.test(line)) {
      partial.priority = ensureMatch(
        line,
        PRIORITY_RE,
        `Invalid PRIORITY line: ${line}`,
      ).priority.toLowerCase();
      continue;
    }

    if (OWNER_RE.test(line)) {
      partial.owner = ensureMatch(
        line,
        OWNER_RE,
        `Invalid OWNER line: ${line}`,
      ).owner;
      continue;
    }

    if (PARENT_RE.test(line)) {
      partial.parent = ensureMatch(
        line,
        PARENT_RE,
        `Invalid PARENT line: ${line}`,
      ).parent;
      continue;
    }

    if (REL_RE.test(line)) {
      partial.relations!.push(toRelation(line));
      continue;
    }

    if (LABEL_RE.test(line)) {
      partial.labels!.push(
        ensureMatch(
          line,
          LABEL_RE,
          `Invalid LABEL line: ${line}`,
        ).label.toLowerCase(),
      );
      continue;
    }

    if (ESTIMATE_RE.test(line)) {
      partial.estimate = ensureMatch(
        line,
        ESTIMATE_RE,
        `Invalid ESTIMATE line: ${line}`,
      ).estimate.toLowerCase();
      continue;
    }

    if (DUE_RE.test(line)) {
      partial.dueDate = ensureMatch(
        line,
        DUE_RE,
        `Invalid DUE line: ${line}`,
      ).dueDate;
      continue;
    }

    if (DESC_RE.test(line)) {
      partial.description = ensureMatch(
        line,
        DESC_RE,
        `Invalid DESC line: ${line}`,
      ).description.trim();
      continue;
    }

    throw new Error(`Unknown work package line: ${line}`);
  }

  const missingRequired = ["workType", "title", "status", "priority"].filter(
    (field) => {
      const value = partial[field as keyof WorkPackageAtom];
      return typeof value !== "string" || value.trim().length === 0;
    },
  );

  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required work package field(s): ${missingRequired.join(", ")}.`,
    );
  }

  return {
    id: partial.id!,
    workType: partial.workType!,
    title: partial.title!,
    status: partial.status!,
    priority: partial.priority!,
    ...(partial.description ? { description: partial.description } : {}),
    ...(partial.owner ? { owner: partial.owner } : {}),
    ...(partial.parent ? { parent: partial.parent } : {}),
    ...(partial.relations && partial.relations.length > 0
      ? { relations: partial.relations }
      : {}),
    ...(partial.labels && partial.labels.length > 0
      ? { labels: partial.labels }
      : {}),
    ...(partial.estimate ? { estimate: partial.estimate } : {}),
    ...(partial.dueDate ? { dueDate: partial.dueDate } : {}),
    extensions: partial.extensions ?? {},
  };
}
