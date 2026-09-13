# ADR-0002 — Canonical Artifact Identity Representation

## Status

Accepted

## Date

2026-09-13

## Context

ADR-0001 establishes the invariant that every graph-addressable canonical
artifact MUST have exactly one non-empty ArtifactId that uniquely identifies the
artifact within the active canonical ArtifactGraph.

ADR-0001 deliberately leaves open where ArtifactId is represented.

Two alternatives were evaluated:

A. ArtifactId is represented directly by each graph-addressable canonical Atom.

B. ArtifactId is represented by a common graph-addressable artifact container
that wraps the canonical Atom.

The existing DSL Core implementation already provides evidence for the
representation model.

`WorkPackageAtom` contains `id` directly.

The Work Package parser reads the identifier from the artifact header and
preserves it in the resulting `WorkPackageAtom`.

The Work Package profile declares `id` with cardinality `1..1` as part of the
canonical `WorkPackageAtom`.

The Requirement User Story profile likewise declares `id` as a required field of
the canonical `RequirementAtom`.

The existing `ArtifactGraph` defines artifact types and relations but does not
define or use a separate canonical artifact container.

The current TypeScript `RequirementAtom` and generic requirement parser do not
preserve an ArtifactId. This contradicts the Requirement profile and the
identity invariant established by ADR-0001.

This inconsistency is treated as existing contract drift. It is not treated as
evidence for a separate artifact-container architecture.

## Decision

ArtifactId MUST be represented directly by every graph-addressable canonical
Atom.

A graph-addressable canonical Atom MUST expose exactly one authoritative
top-level ArtifactId property named `id`.

No other property of the same canonical Atom MUST act as an alternative
ArtifactId or identity source.

DSL Core MUST NOT introduce a second canonical identity owner around a
graph-addressable canonical Atom.

A transport, API, persistence or report envelope can exist, but it MUST NOT
define an alternative ArtifactId for the enclosed canonical Atom.

A common structural identity contract can be used to encode the invariant across
graph-addressable artifact types without introducing an additional runtime
container.

Conceptually:

    GraphAddressableArtifact
        id

             ↑
             │
    ┌────────┴────────┐
    A                 B

A) RequirementAtom id ... B) WorkPackageAtom id ...

Artifact identity and artifact type remain separate concepts.

Example:

    ArtifactId   = REQ-001
    ArtifactType = RequirementAtom

ArtifactId MUST NOT encode artifact revision, content digest, validation state
or admission state.

## Canonical Boundary

An input or parser intermediate without an ArtifactId is not yet a
graph-addressable canonical artifact.

A parser can internally process input before an ArtifactId is available.

Such an intermediate MUST NOT be exposed as a graph-addressable canonical
RequirementAtom.

Canonicalization MUST produce a graph-addressable Atom with a valid ArtifactId
before that Atom participates in ArtifactGraph relations.

## Existing Contract Alignment

The following existing behavior is already aligned with this decision:

### WorkPackageAtom

- `id` is a direct property of the Atom.
- the Work Package parser preserves the identifier.
- the Work Package profile defines `id` as canonical with cardinality `1..1`.

The Requirement implementation currently contains contract drift:

### Requirement profile

The profile declares `id` as a required field of `RequirementAtom`.

### Requirement runtime type

The TypeScript `RequirementAtom` currently does not contain `id`.

### Requirement parser

The generic requirement parser currently returns `RequirementAtom` without an
ArtifactId.

These differences MUST be reconciled before additional graph-addressable
artifact types are introduced.

## Shared Identity Contract

DSL Core MAY introduce a shared TypeScript structural contract equivalent to:

    interface GraphAddressableArtifact {
      id: string;
    }

Such a contract exists only to encode the common identity invariant.

It MUST NOT introduce:

- a second ArtifactId,
- a wrapper object around canonical Atoms,
- duplicate artifact type information,
- or an alternative canonical representation.

The exact internal TypeScript representation of this shared contract is an
implementation decision as long as the invariants of ADR-0001 and this decision
remains satisfied.

## Consequences

`RequirementAtom` MUST eventually expose ArtifactId directly before it is
considered a graph-addressable canonical artifact.

`WorkPackageAtom` retains its existing direct `id` representation.

Every future graph-addressable canonical artifact type MUST follow the same
identity model.

This applies to AcceptanceCriterionAtom once that artifact type is introduced
and to any later graph-addressable canonical artifact types.

The ArtifactGraph remains responsible for relationships between artifact
identities.

ArtifactGraph relation targets MUST continue to resolve to exactly one canonical
artifact identity.

No additional artifact-envelope layer is introduced.

## Rejected Alternative

### Common graph-addressable artifact container

A common container owning ArtifactId was rejected.

It would introduce a new canonical representation that does not exist in the
current ArtifactGraph architecture.

It would conflict with the existing direct identity representation of
WorkPackageAtom or require migration of that representation.

Maintaining both container identity and Atom identity would create two potential
sources of truth.

Migrating all existing Atoms into a new wrapper would introduce unnecessary
breaking changes without providing additional identity semantics.

Shared properties are represented through common contracts rather than through a
mandatory runtime envelope.

## Verification

Implementation of this decision MUST preserve the existing repository quality
gates:

    deno fmt --check
    deno lint
    deno test --allow-read --lock=deno.lock --frozen

The implementation MUST provide deterministic tests proving:

- every graph-addressable canonical Artifact has a non-empty ArtifactId,
- ArtifactId is represented directly on the canonical Atom,
- duplicate ArtifactIds within one active ArtifactGraph are rejected,
- dangling relation targets are rejected,
- Requirement identity survives canonicalization,
- WorkPackage identity behavior remains unchanged,
- no second canonical ArtifactId is introduced.
