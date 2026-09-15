import "dotenv/config";
import express from "express";
import { travelRuleRouter } from "./routes/travelRule.js";

const PORT = process.env.PORT || 4200;
const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/travel-rule", travelRuleRouter);

app.use((_req, res) => res.status(404).json({ error: "not_found" }));

app.listen(PORT, () => {
  console.log(`[travel-rule-api] listening on port ${PORT}`);
});
