import express from "express";
import { createExpressRoutes } from "@cloudbase/agent-server";
import { createAgent } from "./agent.js";
import cors from "cors";
import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

const app = express();

app.use(cors());

createExpressRoutes({
  createAgent,
  express: app,
  basePath: `/v1/aibot/bots/${process.env.AGENT_ID}/`,
  useAGUI: true,
  aguiOptions: {
    agentId: process.env.AGENT_ID!,
  },
});

app.listen(9000, () => console.log("Listening on 9000!"));
