# dsl-core
Core Specification for the **Audit-by-Design DSL**  - Human- and machine-readable domain-specific language (DSL) for defining, validating, and auditing atomic **requirements** (AFOs) in regulated software environments. Open specification, free to use and extend.

**DSL core** is the  open standard that, for the first time, allows software requirements to be defined in a formal, revision-proof, machine-readable, and versioned manner — providing a deterministic and auditable foundation for regulated and trustworthy digital systems.

** DSL Core principles**

- DSL as a formal artifact → machine readability, deterministic validation, and auditability

- Git as the underlying infrastructure → proven, revision-safe versioning and traceability

- Open-source commitment → global interoperability and freedom from vendor lock-in

- Kerkhoff’s principle → transparency, traceability, and verifiability by design

## Rationale

**Trustworthy digital systems** must be built on validated requirements as a fundamental layer of every implementation. Software must be based on requirements that are consistently validated and free of contradictions.

Without formal semantics, requirements cannot be reliably validated.
Without reliable validation, security properties cannot be verified.
Without verifiability, trust cannot be established.

This is a matter of logical necessity.

An open, formal, machine-readable, version-safe standard for requirements is the only proven means of ensuring secure digitization.

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


## License

## License

As of version v0.2.0, this project is licensed under the Apache License 2.0.
Previous releases (≤ v0.1.0) were published under Creative Commons BY 4.0.

For all new contributions and usage, the Apache 2.0 license applies.

© 2025 Sascha Block / Rock the Prototype
