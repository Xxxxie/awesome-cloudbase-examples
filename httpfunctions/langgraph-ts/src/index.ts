import express from "express";
import { createExpressRoutes } from "@cloudbase/ag-server";
import { createAgent } from "./agent.js";
import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

const app = express();

createExpressRoutes({
  createAgent,
  express: app,
  basePath: "/v1/aibot/bots/my-bot/",
});

app.listen(9000, () => console.log("Listening on 9000!"));
