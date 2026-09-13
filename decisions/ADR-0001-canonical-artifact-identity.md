# ADR-0001 — Canonical Artifact Identity

## Status

Accepted

## Date

2026-09-13

## Context

DSL Core represents relationships between software engineering artifacts through the first-class ArtifactGraph model.

Graph relations reference artifacts by identifier. The current WorkPackageGraph validator resolves artifact types from identifier prefixes such as:

- `WP-`
- `REQ-`
- `ADR-`
- `MS-`

The current implementation contains a contract drift around artifact identity.

The requirement profile defines `id` as a required field of the canonical RequirementAtom, while the TypeScript `RequirementAtom` interface currently does not expose an identifier.

The runtime parser also supports requirement statements without an explicit artifact identifier.

Before additional graph-addressable artifact types are introduced, DSL Core requires an explicit identity invariant.

## Decision

Every graph-addressable canonical artifact MUST have exactly one non-empty ArtifactId.

An ArtifactId MUST uniquely identify exactly one artifact within the active canonical ArtifactGraph.

Every graph relation source and target MUST resolve unambiguously to exactly one graph-addressable canonical artifact.

ArtifactId identifies an artifact instance.

ArtifactId MUST NOT be used as a substitute for:

- ArtifactType
- artifact revision or version
- content digest
- validation status

ArtifactType and ArtifactId are independent concepts.

Example:

    ArtifactType = RequirementAtom
    ArtifactId   = REQ-001

Identifier prefixes such as `REQ-`, `ADR-`, `WP-` and `MS-` are part of the current type-resolution mechanism. Prefix-based type inference MUST NOT be treated as the definition of artifact identity itself.

## Representation Boundary

This decision establishes the identity invariant.

It deliberately does not yet decide whether ArtifactId is represented:

1. directly inside every canonical Atom, or
2. in a common graph-addressable canonical artifact container.

That representation decision MUST be made separately after the existing RequirementAtom, profile, parser and ArtifactGraph contracts have been reconciled.

## Consequences

New graph-addressable artifact types MUST define an unambiguous identity.

Duplicate ArtifactIds inside one active canonical ArtifactGraph MUST be rejected.

Empty ArtifactIds MUST be rejected for graph-addressable artifacts.

Dangling relation targets MUST be rejected.

Ambiguous relation targets MUST be rejected.

Additional artifact types such as AcceptanceCriterionAtom MUST NOT be added until the existing canonical artifact identity contract drift has been resolved.

## Existing Contract Drift

At the time of this decision the following differences exist between the requirement profile and runtime representation:

### Requirement profile

The canonical model declares:

- id — required
- actor — required
- subject — required
- modality — required
- action — required

### RequirementAtom runtime type

The TypeScript interface currently declares:

- actor
- modality
- action
- condition
- result

The runtime type currently does not declare:

- id
- subject

The requirement profile currently represents negative modality as `must_not`, while the runtime type represents it as `must not`.

The current generic requirement parser accepts requirement statements without an ArtifactId.

These differences MUST be resolved explicitly and MUST NOT be hidden by the introduction of new artifact types.

## Verification

Implementation of this decision MUST preserve the existing green validation baseline.

The following repository gates MUST remain successful:

    deno fmt --check
    deno lint
    deno test --allow-read --lock=deno.lock --frozen

Future graph validation MUST provide deterministic tests for:

- non-empty ArtifactId
- ArtifactId uniqueness
- relation target resolution
- rejection of duplicate identifiers
- rejection of dangling identifiers
- preservation of existing requirement semantics
