import { BotCore, IBot, SendMessageInput, GetBotInfoOutput } from "@cloudbase/aiagent-framework";
import { ChatDeepSeek } from "@langchain/deepseek";
import { HumanMessage } from "@langchain/core/messages";
import { createSupervisor } from "@langchain/langgraph-supervisor";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createGeneralAgent } from "./lib/generalAgent.js";
import { llmCallback } from "./lib/util.js";
import { omit } from "remeda";
import { ChatToolService } from './lib/chat_tool.service.js';
import { AgentContext } from './lib/agent_context.js';
import { agentConfig } from './lib/agent_config.js';

export class AgentWrapper extends BotCore implements IBot {
  agentContext!: AgentContext<any>;
  private mcpClient: Client | null = null;
  private mcpAgentObj: any = null
  private workerAgents: any[] = [];
  private supervisorAgent: any = null;
  constructor(context: any) {
    super(context);
  }

  setAgent(workerAgents: any[], superVisorAgent: any) {
    this.workerAgents = workerAgents
    this.supervisorAgent = superVisorAgent
  }

  generateInputMessage({ msg, files = [] }: { msg: string; files: string[] }): HumanMessage {
    const humanMessage = files.length ? new HumanMessage({
      content: [
        { type: "text", text: msg + `\n\n用户上传的文件链接：${files.join('\n')}` },
        ...files.map((file: string) => {
          const fileExtension = file.split('.').pop()?.toLowerCase() || '';
          const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

          if (imageExtensions.includes(fileExtension)) {
            // 图片文件使用 image_url 格式
            return { type: "image_url", image_url: { url: file } };
          } else {
            // 非图片文件使用 file 描述格式
            return {
              type: "file",
              source_type: "url",
              url: file,
            };
          }
        }),
        // ...files.map((file: string) => ({ type: "image", source_type: "url", url: file })),
      ]
    }) : new HumanMessage(msg)

    console.log("📨 构建的 humanMessage:", JSON.stringify(humanMessage, null, 2));
    return humanMessage
  }

  createDeepseek(envId: string) {
    return new ChatDeepSeek({
      streaming: true,
      model: agentConfig.model,
      apiKey: this.apiKey,
      configuration: {
        baseURL: `https://${envId}.api.tcloudbasegateway.com/v1/ai/deepseek/v1`,
      },
      callbacks: [llmCallback],
    });
  }

  async sendMessage({ msg, files = [] }: SendMessageInput): Promise<void> {
    const envId =
      this.context.extendedContext?.envId || process.env.CLOUDBASE_ENV_ID;
    console.log("supervisorAgent", this.supervisorAgent)
    if (this.supervisorAgent && this.workerAgents) {
      const humanMessage = this.generateInputMessage({ msg, files })

      // 启动协作，无需流式
      const result = await this.supervisorAgent.invoke({
        messages: [humanMessage],
      });

      console.log("✅ Supervisor 协作完成");
      console.log("📋 最终 messages 数量:", result.messages?.length || 0);
      console.log("📋 最终 messages:", result.messages?.map((m: any) => ({
        type: m.constructor.name,
        content: typeof m.content === 'string' ? m.content.substring(0, 100) + '...' : '[非文本内容]',
        additional_kwargs: m.additional_kwargs
      })));

      // 用 finalMessages 作为 prompt，流式总结
      const streamingLLM = this.createDeepseek(envId);
      const summaryStream = await streamingLLM.stream(result.messages);
      let debugContent = ''

      for await (const chunk of summaryStream) {
        debugContent += chunk.content as string;
        // console.log(
        //   "summary chunk",
        //   omit(chunk, [
        //     "response_metadata",
        //     "usage_metadata",
        //     "lc_kwargs",
        //     "additional_kwargs",
        //     "lc_namespace",
        //     "lc_serializable",
        //   ])
        // );
        this.sseSender.send({
          data: {
            content: chunk.content as string,
            role: "assistant",
            type: "text",
            model: "deepseek-v3-0324",
            finish_reason: "",
          },
        });
      }

      console.log("debugContent", debugContent);
    }

    this.sseSender.end();
  }

  // 从上下文中获取云开发 accessToken
  get apiKey() {
    const accessToken =
      this.context?.extendedContext?.accessToken ||
      process.env.CLOUDBASE_API_KEY;
    if (typeof accessToken !== "string") {
      throw new Error("Invalid accessToken");
    }

    return accessToken.replace("Bearer", "").trim();
  }

  async getBotInfo(): Promise<GetBotInfoOutput> {
    const agentInfo: GetBotInfoOutput = {
      botId: this.botId,
      name: agentConfig.name,
      model: agentConfig.model,
      agentSetting: agentConfig.agentSetting,
      introduction: agentConfig.introduction,
      welcomeMessage: agentConfig.welcomeMessage,
      avatar: agentConfig.avatar,
      isNeedRecommend: agentConfig.isNeedRecommend,
      knowledgeBase: agentConfig.knowledgeBase,
      databaseModel: agentConfig.databaseModel,
      initQuestions: agentConfig.initQuestions,
      searchEnable: agentConfig.searchNetworkEnable,
      searchFileEnable: agentConfig.searchFileEnable,
      mcpServerList: agentConfig.mcpServerList as any,
    };

    return agentInfo;
  }
}
