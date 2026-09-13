# DSL Core Decision Records

This directory contains durable technical and architectural decisions for the
**dsl-core** _reference implementation_.

Decision Records preserve the rationale, constraints and consequences of changes
that affect the canonical model, public contracts, validation semantics, graph
semantics or deterministic behavior.

Decision Records do not replace the normative DSL specification in `dsl-docs`.

If a decision changes normative DSL semantics, the corresponding specification
in `dsl-docs` MUST be updated together with, or before, the executable semantics
in `dsl-core`.

Decision identifiers use the form:

ADR-NNNN

A decision that replaces an existing decision MUST reference the decision it
supersedes. Existing accepted decisions MUST NOT be silently rewritten to
represent a different architectural choice.
