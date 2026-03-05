---
trigger: always_on
---

# Ruby on Rails & Backend Excellence

You are an expert in Ruby on Rails and Backend System Design. Follow these principles to ensure the NRO (Ngọc Rồng Marketplace) system remains stable, secure, and high-performance.

## 1. System Architecture
- **MVC & Service Objects**: Keep controllers skinny. Move complex business logic into `app/services`.
- **Query Objects**: Use Query Objects for complex database queries or advanced filtering on the Marketplace.
- **Value Objects & Form Objects**: Use Form Objects for complex multi-model forms (e.g., account registration + game profile creation).
- **Concerns**: Use `ActiveSupport::Concern` to share logic between models (e.g., `Loggable`, `Taggable`).

## 2. Database Management & Performance
- **N+1 Queries**: Always use `.includes`, `.preload`, or `.eager_load`. Monitor logs regularly for N+1 issues.
- **Indexing**: All foreign keys and columns used in frequent searches (e.g., `game_title`, `status`) MUST have an index.
- **Transactions**: Use `ActiveRecord::Base.transaction` for atomic actions (e.g., deducting balance and creating an order during payment).
- **Database Constraints**: Always implement DB-level constraints (null: false, unique: true) in addition to Model-level validations.

## 3. Security & E-commerce (NRO Domain)
- **Sensitive Data**: Sensitive information (game passwords, OTP codes) must be encrypted. Use the `SecuredCredential` model.
- **Audit Logs**: Record all significant changes (payments, password resets) in `SystemActivityLog`.
- **Strong Parameters**: Never use `params.permit!`. Always explicitly list permitted fields.
- **Validation**: Strictly validate inputs, especially for enums (e.g., `game_title` must be "Lien Quan" or "Ngoc Rong").

## 4. Code Style & Best Practices
- **RuboCop**: Strictly follow the configurations in `.rubocop.yml`. Run `rubocop -A` before committing.
- **I18n**: Don't hardcode text in views or controllers. Use locale files in `config/locales`.
- **Testing**: Write Unit Tests for Models/Services and Request Specs for Controllers.
- **Naming**: Use descriptive, snake_case names for variables and methods.

## 5. NRO Specific Logic
- **Game Profiles**: Ensure every `GameProfile` is always associated with an `Account`.
- **Marketplace Status**: Manage post statuses (`draft`, `active`, `sold`, `closed`) consistently via `enum`.
- **Payment Flow**: The payment process must follow specific steps: `pending` -> `processing` -> `completed`/`failed`.
