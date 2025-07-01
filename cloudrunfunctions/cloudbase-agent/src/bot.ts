import 'dotenv/config'

import {
  BotCore,
  GetBotInfoOutput,
  GetChatRecordInput,
  GetChatRecordOutput,
  GetRecommendQuestionsInput,
  GetTextToSpeechResultInput,
  GetTextToSpeechResultOutput,
  IBot,
  SendMessageInput
} from '@cloudbase/aiagent-framework'

import { botConfig, IBotConfig } from './bot_config'
import { BotContext } from './bot_context'
import { BotInfo } from './bot_info'
import { ChatHistoryService } from './chat_history.service'
import { MainChatService } from './chat_main.service'
import { RecommendQuestionsService } from './chat_recommend_questions.service'
import { replaceEnvId, TcbContext } from './tcb'

export class MyBot extends BotCore implements IBot {
  tcbAgentService: MainChatService
  recommendQuestionsService: RecommendQuestionsService
  chatHistoryService: ChatHistoryService

  constructor (context: TcbContext, botConfig: IBotConfig) {
    super(context)
    const botContext = new BotContext(context)
    botContext.bot = this
    botConfig.baseURL = replaceEnvId(context, botConfig.baseURL)
    botContext.info = new BotInfo(this.botId, botConfig)
    botContext.config = Object.assign({}, botConfig)

    this.tcbAgentService = new MainChatService(botContext)
    this.chatHistoryService = new ChatHistoryService(botContext)
    this.recommendQuestionsService = new RecommendQuestionsService(botContext)
  }

  async sendMessage (input: SendMessageInput): Promise<void> {
    await this.tcbAgentService.chat({
      botId: this.botId,
      msg: input.msg,
      history: input.history,
      files: input.files,
      searchEnable: input.searchEnable
    })

    this.sseSender.end()
  }

  async getRecommendQuestions ({
    msg,
    history
  }: GetRecommendQuestionsInput): Promise<void> {
    await this.recommendQuestionsService.chat({
      msg: msg,
      history: history
    })

    this.sseSender.end()
  }

  async getChatRecords (
    input: GetChatRecordInput
  ): Promise<GetChatRecordOutput> {
    const { sort, pageSize, pageNumber } = input
    const [history, total] = await this.chatHistoryService.describeChatHistory({
      botId: this.botId,
      sort,
      pageSize,
      pageNumber
    })

    return { recordList: history, total: total }
  }

  async getBotInfo (): Promise<GetBotInfoOutput> {
    const botInfo: GetBotInfoOutput = {
      botId: this.botId,
      name: botConfig.name,
      model: botConfig.model,
      agentSetting: botConfig.agentSetting,
      introduction: botConfig.introduction,
      welcomeMessage: botConfig.welcomeMessage,
      avatar: botConfig.avatar,
      isNeedRecommend: botConfig.isNeedRecommend,
      knowledgeBase: botConfig.knowledgeBase,
      databaseModel: botConfig.databaseModel,
      initQuestions: botConfig.initQuestions,
      searchEnable: botConfig.searchNetworkEnable,
      searchFileEnable: botConfig.searchFileEnable,
      mcpServerList: botConfig.mcpServerList,
      voiceSettings: {
        enable: true,
        inputType: '16k_zh',
        outputType: 501007,
      },
    };

    return botInfo
  }

  async speechToText(input: SpeechToTextInput): Promise<SpeechToTextOutput> {
    const result = await this.chatToolService.speechToText(input);
    console.log(result);
    return { Result: result.result };
  }

  async textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    const result = await this.chatToolService.textToSpeech(input);
    return { TaskId: result.taskId };
  }

  async getTextToSpeechResult(
    input: GetTextToSpeechResultInput,
  ): Promise<GetTextToSpeechResultOutput> {
    const result = await this.chatToolService.getTextToSpeechResult(input);
    return {
      TaskId: result.taskId,
      Status: result.status,
      StatusStr: result.statusStr,
      ResultUrl: result.resultUrl,
    };
  }
}
