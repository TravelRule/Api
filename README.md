# Travel-Rule Reference API

Repo: `TravelRule/api`

A reference implementation of an IVMS101-inspired travel-rule messaging API
for anchor-to-anchor transfers on Stellar.

> **Institution-level fields only in this version.** No end-user PII is
> accepted or stored by this API. See
> [`docs/IVMS101_MAPPING.md`](docs/IVMS101_MAPPING.md) for exactly what's
> implemented vs. what a full IVMS101-compliant system would need.

## Documentation

| Doc                                                  | Covers                                               |
| ---------------------------------------------------- | ---------------------------------------------------- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)       | Message lifecycle, schema validation, storage        |
| [`docs/API.md`](docs/API.md)                         | Every endpoint, request/response shapes              |
| [`docs/IVMS101_MAPPING.md`](docs/IVMS101_MAPPING.md) | Field-by-field: what's implemented vs. the full spec |

## Quickstart

This repo depends on `@travel-rule/schema`, installed directly from GitHub
(see `package.json`) — no local sibling checkout needed, just a normal
`npm install`:

```bash
cp .env.example .env
npm install
npm test
npm start
```

## Relationship to the other travel-rule repos

This API is a **separate concern** from the attestation registry — it
handles institution-to-institution message exchange, not counterparty
screening status. A production system might tie the two together (e.g.
require a clear attestation before accepting a message), but this
reference implementation deliberately keeps them independent, per the
loosely-coupled repo-split rationale in the root playbook.

```
attestation-registry   -- separate concern: on-chain screening status
screening-service       -- separate concern: off-chain screening
api                     <- you are here (this repo)
dashboard               -- reads from both this API and screening-service
schema                  -- shared schemas this API depends on
```
