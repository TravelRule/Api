import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { travelRuleRouter } from "../routes/travelRule.js";
import { _resetStoreForTests } from "../store.js";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/travel-rule", travelRuleRouter);
  return app;
}

beforeEach(() => {
  _resetStoreForTests();
});

const validMessage = {
  originatorInstitution: { name: "Anchor A", lei: "12345678901234567890" },
  beneficiaryInstitution: { name: "Anchor B", lei: "09876543210987654321" },
  paymentReference: "tx-hash-abc123",
  amount: "100.00",
  asset: "USDC",
};

test("POST /travel-rule/message accepts a valid message", async () => {
  const app = buildApp();
  const res = await request(app).post("/travel-rule/message").send(validMessage);

  assert.equal(res.status, 201);
  assert.equal(res.body.data.paymentReference, "tx-hash-abc123");
  assert.ok(res.body.data.id);
});

test("POST /travel-rule/message rejects a message missing required fields", async () => {
  const app = buildApp();
  const { paymentReference, ...incomplete } = validMessage;
  const res = await request(app).post("/travel-rule/message").send(incomplete);

  assert.equal(res.status, 400);
  assert.equal(res.body.error, "schema_validation_failed");
});

test("POST /travel-rule/message rejects an LEI of the wrong length", async () => {
  const app = buildApp();
  const bad = { ...validMessage, originatorInstitution: { ...validMessage.originatorInstitution, lei: "tooshort" } };
  const res = await request(app).post("/travel-rule/message").send(bad);

  assert.equal(res.status, 400);
});

test("GET /travel-rule/message/:id returns a previously saved message", async () => {
  const app = buildApp();
  const created = await request(app).post("/travel-rule/message").send(validMessage);
  const id = created.body.data.id;

  const fetched = await request(app).get(`/travel-rule/message/${id}`);
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.data.id, id);
});

test("GET /travel-rule/message/:id returns 404 for an unknown id", async () => {
  const app = buildApp();
  const res = await request(app).get("/travel-rule/message/does-not-exist");
  assert.equal(res.status, 404);
});

test("GET /travel-rule/message lists recent messages", async () => {
  const app = buildApp();
  await request(app).post("/travel-rule/message").send(validMessage);
  await request(app).post("/travel-rule/message").send(validMessage);

  const res = await request(app).get("/travel-rule/message");
  assert.equal(res.status, 200);
  assert.equal(res.body.data.length, 2);
});
