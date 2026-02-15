# Schema Contracts (Public)

This folder contains **public JSON Schema contracts** for `dsl-core`. These
contracts define the **stable, machine-consumable outputs** of the engine (e.g.,
validation and audit reports).

They are **not** internal implementation details.

---

## Scope

### In scope (public contracts)

- JSON Schemas that describe **tool outputs** (reports, evidence artifacts)
- Versioning rules for compatibility and breaking changes
- How downstream tools (CI, orchestrators, external orgs) should consume these
  contracts

### Out of scope (internal engine)

- Parser/AST/internal data models
- Rule implementations
- Runtime-only types and helper structures

Internal engine structures live under `src/model/**` (formerly `src/schema/**`)
and are **not contracts**.

---

## Contracts in this folder

### `report.schema.json`

Defines the canonical shape of the **DSL validation/report output** produced by:

- `dsl report …` (reference CLI)
- any future API/server wrapper that emits the same report artifact

This schema is the **primary integration contract** for:

- CI pipelines (pass/fail gates + evidence artifacts)
- `rock-the-project-dsl-collab` (job/opportunity generation)
- external auditors / compliance toolchains

---

## Contract stability guarantees

### 1) Compatibility principle

Downstream tools should be able to **pin to a schema version** and rely on
deterministic behavior.

### 2) Backwards-compatible changes (allowed)

- Adding **optional** properties
- Adding new enum values **if** existing values remain valid
- Adding new error/rule types **without** changing existing ones
- Adding new sections that do not invalidate existing documents

### 3) Breaking changes (explicit)

Breaking changes require:

- a **major** version bump of the contract
- release notes describing the migration

Examples of breaking changes:

- removing or renaming properties
- changing a property type
- making an optional property required
- changing semantics in a way that makes old reports invalid

---

## Versioning

### Contract version vs. engine version

- Engine releases may evolve frequently.
- Contract changes are managed with extra care.

Recommended fields inside each report document (emitted by the engine):

- `engine.version` (SemVer)
- `contract.id` (e.g. `"dsl-core/report"`)
- `contract.version` (SemVer)
- `contract.schema` (path or identifier of the schema used)

> The engine should always be able to emit a report that conforms to the schema
> version it declares.

---

## Consumption & pinning

Downstream tooling should pin **exact versions** (tag/commit) for
reproducibility.

Recommended pinning patterns:

- Git tag pin (preferred): `vX.Y.Z`
- Commit SHA pin (highest integrity)

Example (conceptual):

- `.../dsl-core@vX.Y.Z/schemas/report.schema.json`
- `.../dsl-core@<commit-sha>/schemas/report.schema.json`

---

## Relationship to internal models (`src/model`)

- `src/model/**` defines the internal data structures used by the engine.
- `/schemas/**` defines the external, stable “wire format” for reports.

Rule of thumb:

> Internal models may change for correctness and maintainability. Public
> contracts only change when necessary. Every single artefact always evoles with
> clear versioning.

---

## Contribution rules for contracts

When changing a contract:

1. Update the JSON Schema.
2. Update or add examples in `examples/**` (if present) so consumers can
   validate.
3. Add/adjust tests that validate sample outputs against the schema.
4. Document the change in the project changelog/release notes.
