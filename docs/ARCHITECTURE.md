# Architecture

## Message lifecycle

```
POST /travel-rule/message
      │
      ▼
 fill createdAt if missing
      │
      ▼
 validate against @travel-rule/schema's travelRuleMessageSchema (Ajv)
      │
      ├── invalid ──▶ 400 { error: "schema_validation_failed", details }
      │
      ▼ valid
 store.saveMessage()  ──▶  assigns an id, stores in memory
      │
      ▼
 201 { data: <saved message with id> }
```

Reads (`GET /travel-rule/message/:id`, `GET /travel-rule/message`) are
straightforward lookups against the same in-memory store — no validation
needed on the read path.

## Why schema validation lives in a shared package

`@travel-rule/schema` is installed straight from its own GitHub repo (see
its README) so
that `dashboard` can validate/understand the same shape without
duplicating the schema definition. If this API's message shape changes,
update the schema package once — both this API and the dashboard pick up
the change (dashboard on its next build, this API on its next
`npm install`).

## Storage

Same caveat as the screening-service: `src/store.js` is an in-memory `Map`,
fine for reference/demo purposes, not for production. A production
deployment needs a durable store — and probably needs to think about
retention policy for travel-rule messages specifically, since these often
have their own regulatory retention requirements distinct from ordinary
application data. That's explicitly not decided here.

## What's NOT implemented (see root playbook's "explicitly out of scope")

- Encryption in transit beyond whatever TLS termination sits in front of
  this API in your deployment (e.g. a load balancer) — there's no
  message-level encryption on top of that here.
- Counterparty discovery (how would Anchor A know Anchor B's API endpoint
  in the first place?) — this reference implementation assumes both anchors
  already know each other's API URL out of band.
- Full IVMS101 field coverage — see `docs/IVMS101_MAPPING.md`.
