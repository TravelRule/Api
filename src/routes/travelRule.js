import { Router } from "express";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { travelRuleMessageSchema } from "@travel-rule/schema";
import { saveMessage, getMessage, listMessages } from "../store.js";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateMessage = ajv.compile(travelRuleMessageSchema);

export const travelRuleRouter = Router();

// POST /travel-rule/message
travelRuleRouter.post("/message", (req, res) => {
  const body = req.body ?? {};

  // Fill createdAt server-side if the caller didn't provide one, so
  // validation doesn't reject an otherwise-valid message just for omitting
  // a timestamp.
  const candidate = { createdAt: new Date().toISOString(), ...body };

  const valid = validateMessage(candidate);
  if (!valid) {
    return res.status(400).json({
      error: "schema_validation_failed",
      details: validateMessage.errors,
    });
  }

  const record = saveMessage(candidate);
  res.status(201).json({ data: record });
});

// GET /travel-rule/message/:id
travelRuleRouter.get("/message/:id", (req, res) => {
  const message = getMessage(req.params.id);
  if (!message) {
    return res.status(404).json({ error: "not_found" });
  }
  res.json({ data: message });
});

// GET /travel-rule/message — list recent messages (used by the dashboard)
travelRuleRouter.get("/message", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  res.json({ data: listMessages({ limit }) });
});
