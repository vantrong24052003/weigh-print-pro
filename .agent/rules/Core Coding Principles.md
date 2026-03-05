# Core Coding Principles & Defensive Programming

## 1. Core Principles
- **KISS (Keep It Simple, Stupid)**: Write simple, readable code. Avoid over-engineering.
- **YAGNI (You Ain't Gonna Need It)**: Implement only what is requested. Don't add features "just in case".
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into hooks, components, or service objects.
- **SOLID (S & O)**: Each component should have one responsibility. Open for extension (props), closed for modification.

## 2. Defensive Programming
- **Safe Access**: Always use optional chaining (`?.`) and nullish coalescing (`??`) for nested properties.
- **Empty States**: Every list component must handle empty states gracefully.
- **Loading/Error States**: Use skeletons for loading and clear alerts/notifications for errors.
- **Error Boundaries**: Wrap major features (Auth, Dashboard, Payments) in Error Boundaries.
- **Validation**: Use strict validation (e.g., Zod, dry-validation, or Model validations) BEFORE processing form input.

## 3. Clean Code & Commenting
- **Minimalist Commenting**: Do not write redundant comments. Code should be self-documenting through clear variable and function naming.
- **Complex Logic Only**: Write comments only for complex algorithms or non-obvious design decisions.
- **Explain "Why", not "What"**: Comments should explain why a logic exists rather than describing what the code is doing.
