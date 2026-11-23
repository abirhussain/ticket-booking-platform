# Auth Registration Use Case Specification

**Status:** First behavior selected for the TDD learning sequence  
**Owner:** Auth service  
**Scope:** Registration business behavior; HTTP and PostgreSQL adapters are later steps.

## Goal

Create an Auth user safely while keeping registration rules in the Auth service. Auth is the only service that may access the Auth database and its `users` table.

## Boundaries

- The HTTP route will validate and parse external input before calling the use case.
- The registration use case coordinates a service-owned user repository and password hasher.
- The repository owns Auth SQL. It is not shared with other services.
- PostgreSQL remains the source of truth for uniqueness. The database will enforce case-insensitive unique email addresses so concurrent registrations cannot create duplicates.
- The password hasher will use Argon2id when its adapter is implemented. The use case depends on a hasher interface, not a particular library.
- This first slice does not create an HTTP endpoint, database connection, migration runner, JWT, or refresh-token flow.

## Input and output

Input to the use case:

- `email`: a syntactically valid email already accepted by the input-validation layer.
- `password`: a password already accepted by the input-validation layer.

Successful output contains only:

- `id`
- normalized `email`

It must never include the plaintext password or password hash.

## Behavior

1. Trim surrounding whitespace from the email and lowercase it for consistent lookup and storage.
2. Ask the Auth user repository whether that normalized email already exists.
3. If it exists, return a typed duplicate-email error. Do not hash the password or create a user.
4. If it does not exist, hash the password using the injected password-hasher dependency.
5. Ask the Auth user repository to create the user with the normalized email and password hash.
6. Return the public user fields only (`id` and normalized `email`).

If the database reports a uniqueness conflict during creation (for example, two requests passed the lookup at the same time), the repository/use-case boundary must map it to the same duplicate-email outcome. This race case will be covered when the PostgreSQL repository is added.

## Acceptance criteria for the first unit-test slice

- [x] A successful registration normalizes the email, stores only a password hash, and returns public fields.
- [ ] A known duplicate email produces a typed duplicate-email error without hashing or creating a user.
- [ ] Tests use a fake repository and fake hasher; no database or network is needed for these use-case tests.

## Later acceptance criteria

- [ ] Invalid external email/password input is rejected by the HTTP validation layer before the use case runs.
- [ ] The PostgreSQL schema enforces case-insensitive email uniqueness.
- [ ] A database uniqueness race is translated into the duplicate-email outcome.
- [ ] Password hashing uses Argon2id; plaintext passwords and hashes are never returned or logged.
- [ ] The HTTP route maps duplicate registration to a documented conflict response.
