import { createAgent as createLangchainAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { LangchainAgent } from "@cloudbase/ag-adapter-langchain";

const checkpointer = new MemorySaver();

export function createAgent() {
  // Configure model
  const model = new ChatOpenAI({
    model: process.env.OPENAI_MODEL!,
    apiKey: process.env.OPENAI_API_KEY!,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL!,
    },
  });

  // Create agent
  const lcAgent = createLangchainAgent({
    model,
    checkpointer,
  });

  return {
    agent: new LangchainAgent({
      agent: lcAgent,
      name: "agentic-chat-agent",
      description: "A helpful AI assistant",
    }),
  };
}
