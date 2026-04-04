import type { WorkPackageAtom } from "../types/WorkPackageAtom.ts";
import type {
  ArtifactGraphConstraint,
  ArtifactGraphProfile,
  ArtifactGraphRelationType,
  ArtifactType,
} from "../types/ArtifactGraph.ts";
import type { ValidationError } from "./types.ts";

export interface WorkPackageGraphValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function parseCardinalityMax(cardinality: string): number | null {
  const parts = cardinality.split("..");
  if (parts.length !== 2) {
    throw new Error(`Invalid cardinality format: ${cardinality}`);
  }

  return parts[1] === "*" ? null : Number(parts[1]);
}

function inferArtifactType(id: string): ArtifactType {
  if (id.startsWith("WP-")) return "WorkPackageAtom";
  if (id.startsWith("REQ-")) return "RequirementAtom";
  if (id.startsWith("ADR-")) return "DecisionAtom";
  if (id.startsWith("MS-")) return "MilestoneAtom";

  throw new Error(`Cannot resolve artifact type from id: ${id}`);
}

function getRelationDefinition(
  profile: ArtifactGraphProfile,
  relationType: string,
): ArtifactGraphRelationType | undefined {
  return profile.artifactGraph.relationTypes.find((relation) =>
    relation.name === relationType
  );
}

function buildAdjacencyForAcyclicRelation(
  workPackages: WorkPackageAtom[],
  relationName: string,
): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();

  for (const workPackage of workPackages) {
    const outgoing = (workPackage.relations ?? [])
      .filter((relation) => relation.type === relationName)
      .map((relation) => relation.target);

    adjacency.set(workPackage.id, outgoing);
  }

  return adjacency;
}

function detectCycle(adjacency: Map<string, string[]>): boolean {
  const visited = new Set<string>();
  const inStack = new Set<string>();

  function visit(node: string): boolean {
    if (inStack.has(node)) {
      return true;
    }

    if (visited.has(node)) {
      return false;
    }

    visited.add(node);
    inStack.add(node);

    for (const target of adjacency.get(node) ?? []) {
      if (!adjacency.has(target)) {
        continue;
      }

      if (visit(target)) {
        return true;
      }
    }

    inStack.delete(node);
    return false;
  }

  for (const node of adjacency.keys()) {
    if (visit(node)) {
      return true;
    }
  }

  return false;
}

function validateGraphConstraints(
  profile: ArtifactGraphProfile,
  workPackages: WorkPackageAtom[],
  errors: ValidationError[],
): void {
  const relationTypesWithAcyclicConstraint = profile.artifactGraph.relationTypes
    .filter((relation) => relation.acyclic)
    .map((relation) => relation.name);

  for (const relationName of relationTypesWithAcyclicConstraint) {
    const adjacency = buildAdjacencyForAcyclicRelation(
      workPackages,
      relationName,
    );

    if (detectCycle(adjacency)) {
      errors.push({
        ruleId: "GRAPH.WORK_PACKAGE.CYCLE.001",
        severity: "error",
        field: "relations",
        message:
          `The relation '${relationName}' is declared as acyclic and MUST NOT form cycles.`,
      });
    }
  }
}

function validateDeclaredConstraints(
  constraints: ArtifactGraphConstraint[],
  errors: ValidationError[],
): void {
  const knownConstraintIds = new Set([
    "GRAPH.WORK_PACKAGE.PARENT_CHILD.001",
    "GRAPH.WORK_PACKAGE.CYCLE.001",
    "GRAPH.WORK_PACKAGE.TARGET_TYPE.001",
  ]);

  for (const constraint of constraints) {
    if (!knownConstraintIds.has(constraint.id)) {
      errors.push({
        ruleId: "GRAPH.WORK_PACKAGE.CONSTRAINT.001",
        severity: "warning",
        field: "artifactGraph.constraints",
        message:
          `The declared graph constraint '${constraint.id}' is not recognized by the current validator runtime.`,
      });
    }
  }
}

export function validateWorkPackageGraph(
  profile: ArtifactGraphProfile,
  workPackages: WorkPackageAtom[],
): WorkPackageGraphValidationResult {
  const errors: ValidationError[] = [];

  validateDeclaredConstraints(profile.artifactGraph.constraints, errors);

  for (const workPackage of workPackages) {
    const relationCountByType = new Map<string, number>();

    for (const relation of workPackage.relations ?? []) {
      relationCountByType.set(
        relation.type,
        (relationCountByType.get(relation.type) ?? 0) + 1,
      );

      const definition = getRelationDefinition(profile, relation.type);

      if (!definition) {
        errors.push({
          ruleId: "GRAPH.WORK_PACKAGE.RELATION_TYPE.001",
          severity: "error",
          field: "relations[].type",
          message:
            `The relation type '${relation.type}' is not allowed by the active graph profile.`,
        });
        continue;
      }

      if (!definition.sourceTypes.includes("WorkPackageAtom")) {
        errors.push({
          ruleId: "GRAPH.WORK_PACKAGE.SOURCE_TYPE.001",
          severity: "error",
          field: "relations[].type",
          message:
            `The relation type '${relation.type}' does not allow WorkPackageAtom as a source type.`,
        });
      }

      let targetType: ArtifactType;
      try {
        targetType = inferArtifactType(relation.target);
      } catch {
        errors.push({
          ruleId: "GRAPH.WORK_PACKAGE.TARGET_TYPE.001",
          severity: "error",
          field: "relations[].target",
          message:
            `The relation target '${relation.target}' cannot be resolved to a known artifact type.`,
        });
        continue;
      }

      if (!definition.targetTypes.includes(targetType)) {
        errors.push({
          ruleId: "GRAPH.WORK_PACKAGE.TARGET_TYPE.001",
          severity: "error",
          field: "relations[].target",
          message:
            `The relation '${relation.type}' does not allow target type '${targetType}'.`,
        });
      }
    }

    for (const definition of profile.artifactGraph.relationTypes) {
      const max = parseCardinalityMax(definition.cardinality);
      if (max === null) {
        continue;
      }

      const count = relationCountByType.get(definition.name) ?? 0;
      if (count > max) {
        errors.push({
          ruleId: "GRAPH.WORK_PACKAGE.CARDINALITY.001",
          severity: "error",
          field: "relations",
          message:
            `The relation '${definition.name}' allows at most ${max} occurrence(s), but '${workPackage.id}' defines ${count}.`,
        });
      }
    }
  }

  validateGraphConstraints(profile, workPackages, errors);

  return {
    valid: errors.every((error) => error.severity !== "error"),
    errors,
  };
}
