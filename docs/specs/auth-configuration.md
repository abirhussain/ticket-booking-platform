# Auth Configuration Specification

**Status:** First Auth foundation behavior  
**Owner:** Auth service

## Goal

Load and validate Auth's process configuration once during startup. Invalid configuration must stop startup with a clear error that identifies the invalid setting without printing its value.

## Scope

This step covers only the service-owned configuration loader. HTTP server startup, database settings, and secret values will be specified in later steps when those dependencies are introduced.

## Configuration contract

- `NODE_ENV` accepts `development`, `test`, or `production`; default is `development`.
- `PORT` is required and must be an integer from 1 through 65535.
- `LOG_LEVEL` accepts `fatal`, `error`, `warn`, `info`, `debug`, `trace`, or `silent`; default is `info`.
- The loader can receive an environment map as an argument so behavior can be tested without mutating the test process environment.
- On invalid input, the loader throws a clear configuration error that names the invalid field(s) and does not include any supplied value.

## First acceptance test

- [x] Given `PORT=3001` and no optional values, loading config returns `NODE_ENV=development`, `PORT=3001`, and `LOG_LEVEL=info`.

## Follow-up acceptance tests

- [ ] Reject missing, non-integer, or out-of-range ports.
- [ ] Reject unsupported environment and log-level values.
- [ ] Invalid-value errors identify field names without echoing values.
