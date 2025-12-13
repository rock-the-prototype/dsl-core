# Audit-by-Design DSL — DSL Core
*DSL Core** is the open standard specification that allows software requirements to be defined in a formal, revision-proof, machine-readable, and versioned manner — providing a deterministic and auditable foundation for regulated and trustworthy digital systems.

---

## Rationale

**Trustworthy digital systems** must be built on validated requirements as a fundamental layer of every implementation. Software must be based on requirements that are consistently validated and free of contradictions.

Without formal semantics, requirements cannot be reliably validated.
Without reliable validation, security properties cannot be verified.
Without verifiability, trust cannot be established.

This is a matter of logical necessity.

---

## Purpose
This repository contains the **normative core implementation** of the Audit-by-Design DSL.

While the DSL specification defines *how requirements are expressed*,  
`dsl-core` defines **what is considered valid, consistent, and auditable**.

It provides the executable semantics required to:

- parse DSL statements
- validate syntax and structure
- enforce semantic and consistency rules
- normalize atomic requirements (AFOs)
- produce deterministic validation results
- serve as the technical reference for tooling, automation, and audits

This repository does **not** generate secure code.  
It defines the **precondition under which secure and auditable software becomes possible**.

---

**DSL-Core** is an **open specification**, **free to use and extend**.
An open, formal, machine-readable, version-safe standard for requirements is the only proven means of ensuring secure digitization.

for the **Audit-by-Design DSL**  - Human- and machine-readable **D**omain-**S**pecific **L**anguage (DSL) for *defining*, *validating*, and *auditing* atomic **requirements** (AFOs) in regulated software environments. 

**DSL core** is the  open standard that, for the first time, allows software requirements to be defined in a formal, revision-proof, machine-readable, and versioned manner — providing a deterministic and auditable foundation for regulated and trustworthy digital systems.



**DSL Core principles**

- DSL as a formal artifact → machine readability, deterministic validation, and auditability

- Git as the underlying infrastructure → proven, revision-safe versioning and traceability

- Open-source commitment → global interoperability and freedom from vendor lock-in

- Kerkhoff’s principle → transparency, traceability, and verifiability by design

## MVP-Based, Iterative Development

The DSL Core follows an **iterative, prototype-driven approach**.  
Each version of the parser, normalizer, and validator is treated as a **minimum viable prototype (MVP)**  
that must be functional, auditable, and testable before advancing to the next stage.

This iterative prototypical approach ensures:
- **Early validation** of syntax and semantics  
- **Transparent evolution** of the language and its rules  
- **Continuous feedback loops** between specification (`dsl-docs`) and implementation (`dsl-core`)  
- **Full traceability** from every change in grammar to its technical representation

### MVP Milestones

| Version | Focus | Outcome |
|----------|--------|----------|
| **MVP 1** | Basic parsing and normalization | Human-readable sentences converted to JSON |
| **MVP 2** | Schema-based validation | Requirements validated against JSON Schema |
| **MVP 3** | Error diagnostics | Parser provides structured error codes and line references |
| **MVP 4** | Audit hooks | CI/CD integration and compliance reports |
| **MVP 5** | CLI and API layer | Local validation and remote audit endpoints |

Each MVP builds on the previous one — keeping complexity low,  
but transparency and auditability high.


## Scope

`dsl-core` focuses exclusively on **requirements validation**, not on implementation.

In scope:
- formal parsing of DSL artifacts
- deterministic validation rules
- consistency and contradiction detection
- normalization of atomic requirements
- machine-verifiable audit outputs

Out of scope:
- application logic
- user interfaces
- security scanning of source code
- code generation
- runtime enforcement

---

## Relation to dsl-docs

| Repository  | Responsibility |
|------------|----------------|
| `dsl-docs` | Human-readable DSL specification (concepts, grammar, semantics, rationale) |
| `dsl-core` | Machine-enforceable reference implementation (parsing, validation, normalization) |

The specification is **normative in text**.  
`dsl-core` is **normative in execution**.

If a requirement is accepted by `dsl-core`, it is considered **formally valid by definition of the standard**.

---

## Typical Use Cases

- Validate requirements in CI/CD pipelines
- Detect contradictions before implementation starts
- Enforce atomicity and testability of requirements
- Generate reproducible audit evidence
- Support regulated software development (e.g. health, government, critical infrastructure)
- Constrain AI-generated requirements or acceptance criteria using formal rules

---

## Architecture Overview

The core is designed as a composable validation pipeline:

- **Parser** → transforms DSL input into a structured representation
- **Normalizer** → enforces atomicity and canonical form
- **Validator** → applies deterministic syntax and semantic rules
- **Report Generator** → produces machine-readable validation and audit output

Each component is designed to be usable independently or as part of automated toolchains.

---

## Status

`dsl-core` is under active development and evolves alongside the DSL specification.

Breaking changes are treated as **standard changes**, not as refactorings, and are documented accordingly.

---

## Philosophy

> Requirements must be explicit before software can be trusted.  
> Validation must be automated before trust can scale.

---

## License

As of version v0.2.0, this project is licensed under the Apache License 2.0.
Previous releases (≤ v0.1.0) were published under Creative Commons BY 4.0.

For all new contributions and usage, the Apache 2.0 license applies.

© 2025 Sascha Block / Rock the Prototype
