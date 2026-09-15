# API reference

Base URL (local dev): `http://localhost:4200`

## `GET /health`
```json
{ "status": "ok" }
```

## `POST /travel-rule/message`

**Request body** (see the shared schema for the authoritative definition):
```json
{
  "originatorInstitution": { "name": "Anchor A", "lei": "12345678901234567890", "country": "US" },
  "beneficiaryInstitution": { "name": "Anchor B", "lei": "09876543210987654321", "country": "DE" },
  "paymentReference": "stellar-tx-hash-or-similar",
  "amount": "100.00",
  "asset": "USDC"
}
```

`createdAt` is optional — filled in server-side with the current time if
omitted.

**Response (201):**
```json
{
  "data": {
    "id": "1",
    "originatorInstitution": { "...": "..." },
    "beneficiaryInstitution": { "...": "..." },
    "paymentReference": "stellar-tx-hash-or-similar",
    "amount": "100.00",
    "asset": "USDC",
    "createdAt": "2026-09-14T10:00:00.000Z",
    "receivedAt": "2026-09-14T10:00:00.050Z"
  }
}
```

**Response (400)** on schema validation failure:
```json
{
  "error": "schema_validation_failed",
  "details": [ /* raw Ajv error objects */ ]
}
```

## `GET /travel-rule/message/:id`

Returns `{ "data": <message> }`, or `404 { "error": "not_found" }`.

## `GET /travel-rule/message?limit=`

Recent messages, most recent first. `limit` defaults to 20, capped at 100.
