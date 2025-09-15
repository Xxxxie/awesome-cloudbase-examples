import { ChatDeepSeek } from "@langchain/deepseek";
import { llmCallback } from "./util.js";

export const createDeepseek = (envId: string, model: string, apiKey: string) => {
  return new ChatDeepSeek({
    streaming: true,
    model: model,
    apiKey: apiKey,
    configuration: {
      baseURL: `https://${envId}.api.tcloudbasegateway.com/v1/ai/deepseek/v1`,
    },
    callbacks: [llmCallback],
  });
}