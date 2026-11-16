# Ticket booking platform

A monorepo containing four independent microservices and an API gateway.
Each service owns its dependencies, lockfile, configuration, tests, and image.
Services communicate through HTTP APIs and RabbitMQ events, not source imports.
There are no npm workspaces or shared application packages.

## Repository structure

```text
services/
  auth/             Identity, login, and refresh tokens
  events/           Event catalog and caching
  booking/          Seat allocation, bookings, and outbox
  notifications/    Event consumption and email delivery
  gateway/          Routing, JWT validation, and rate limiting
web/                React frontend
infra/terraform/
  modules/          network, rds, ecs-service, alb, mq, redis
  envs/             staging, prod
docs/
  adr/              Architecture decision records
  contracts/        HTTP and event contract documentation
loadtests/          Load-test scenarios
.github/workflows/  Per-service checks and deployment workflows
```

Each service has `src/routes`, `src/services`, `src/middleware`,
`src/contracts`, and `tests`. Database-owning services also have
`src/repositories` and `migrations`; Notifications additionally has
`src/consumers`. The gateway has no database migrations.

`src/contracts` contains schemas owned by that service. `docs/contracts`
contains boundary documentation, not an imported runtime library.

## Implementation status

This is a directory scaffold, not a completed application. `.gitkeep` files
preserve empty directories in Git. Service entry points, configuration,
loggers, health endpoints, package scripts, lockfiles, Dockerfiles, and tests
will be written as each service is implemented. Auth currently has only its
initial npm manifest. Install and build within each service directory; no
service should depend on root-installed packages or another service's source.

`docker-compose.yml` provides local infrastructure. `docker-compose.test.yml`
is reserved for future test orchestration.
