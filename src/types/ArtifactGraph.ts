export type ArtifactType =
  | "WorkPackageAtom"
  | "RequirementAtom"
  | "DecisionAtom"
  | "MilestoneAtom";

export interface ArtifactGraphRelationType {
  name: string;
  sourceTypes: ArtifactType[];
  targetTypes: ArtifactType[];
  cardinality: string;
  acyclic: boolean;
}

export interface ArtifactGraphConstraint {
  id: string;
  description: string;
}

export interface ArtifactGraphDefinition {
  rootType: ArtifactType;
  relationTypes: ArtifactGraphRelationType[];
  constraints: ArtifactGraphConstraint[];
}

export interface ArtifactGraphProfile {
  schemaVersion: string;
  profileId: string;
  name: string;
  description: string;
  artifactGraph: ArtifactGraphDefinition;
  output?: {
    report?: {
      format: string;
      ruleIdRequired: boolean;
      deterministic: boolean;
      includeSourceLocations: boolean;
      exitCodes: {
        ok: number;
        invalid: number;
        parse_error: number;
      };
    };
  };
}
