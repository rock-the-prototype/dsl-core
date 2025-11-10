# dsl-core
Core Specification for the Audit-by-Design DSL - Human- and machine-readable domain-specific language (DSL) for defining, validating, and auditing atomic requirements (AFOs) in regulated software environments. Open specification, free to use and extend.

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

The **Audit-by-Design DSL Core Specification** is released under  
[Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).  
© 2025 Sascha Block / Rock the Prototype
