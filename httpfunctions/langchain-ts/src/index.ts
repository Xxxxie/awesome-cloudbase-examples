import express from "express";
import { createExpressRoutes } from "@cloudbase/agent-server";
import { LangchainAgent } from "@cloudbase/agent-adapter-langchain";
import { createAgent as createLangchainAgent } from "./agent.js";
import cors from "cors";
import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

function createAgent() {
  const lcAgent = createLangchainAgent();

  return {
    agent: new LangchainAgent({
      agent: lcAgent,
    }),
  };
}

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
