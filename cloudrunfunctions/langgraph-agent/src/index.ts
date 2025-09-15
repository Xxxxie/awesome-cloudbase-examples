import { BotRunner } from "@cloudbase/aiagent-framework";
import { TcbEventFunction } from "@cloudbase/functions-typings";
import { AgentWrapper } from "./bot.js";
import { filterLog, getApiKey } from "./lib/util.js";
import { BotContext } from './lib/bot_context.js';
import { botConfig } from './lib/bot_config';
import { BotInfo } from './lib/bot_info.js';
import { generateWorkerAgents, generateSupervisorAgent } from './lib/generalAgent.js'
import { createDeepseek } from './lib/llm.js'

filterLog();

export const main: TcbEventFunction<unknown> = async function (event, context) {
  const agentWrapper = new AgentWrapper(context)
  const botId = agentWrapper.botId;

  // 获取 envId 和 apiKey
  const envId =
    context.extendedContext?.envId || process.env.CLOUDBASE_ENV_ID;
  !envId &&
    console.warn(
      "Missing envId, if running locally, please configure \`CLOUDBASE_ENV_ID\` environment variable."
    );
  const apiKey = getApiKey(context)

  // 初始化 botContext，后续构造 agent 用
  const botContext = new BotContext(context, {});
  botContext.config = Object.assign({}, botConfig);
  botContext.info = new BotInfo(botId, botConfig);
  botContext.bot = agentWrapper;

  // 构造 worker 的 LLM 与 Agent
  const workerAgentLLM = createDeepseek(envId, botContext.config.model, apiKey);
  const workerAgents = generateWorkerAgents(workerAgentLLM, botContext)

  // 构造 supervisor 的 LLM 与 Agent
  const superVisorAgentLLM = createDeepseek(envId, botContext.config.model, apiKey);
  const superVisorAgent = generateSupervisorAgent(workerAgents, superVisorAgentLLM)

  agentWrapper.setAgent(workerAgents, superVisorAgent)

  return BotRunner.run(event, context, agentWrapper);
};