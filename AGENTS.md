# Project Rules

- Keep market data integrations behind TanStack server functions and return plain serializable DTOs, because provider fetches must stay server-side and edge-safe.
- Treat imported fundamental metrics as optional evidence in the signal engine, so missing or blocked provider data never overrides the technical model.
