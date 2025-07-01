import { GetTextToSpeechResultInput, SpeechToTextInput, TextToSpeechInput, aitools } from '@cloudbase/aiagent-framework'

import { BotContext } from './bot_context'

type ToolCallResultT =
  | aitools.SearchDBResult
  | aitools.SearchNetworkResult
  | aitools.SearchFileResult
  | aitools.SearchKnowledgeResult;

interface ToolCallResult<T extends ToolCallResultT> {
  // 工具返回的结果
  result: T;
  // 接口内基于 result 封装的提示词
  prompt: string;
}

export class ChatToolService {
  botContext: BotContext

  constructor (botContext: BotContext) {
    this.botContext = botContext
  }

  async handleSearchNetwork ({
    msg,
    searchEnable
  }): Promise<ToolCallResult<aitools.SearchNetworkResult>> {
    if (!searchEnable) {
      return null
    }

    const result = await this.botContext.bot.tools.searchNetwork(
      this.botContext.info.botId,
      msg
    )

    if (result) {
      const data = {
        type: 'search',
        created: Date.now(),
        model: 'hunyuan',
        role: 'assistant',
        content: '',
        search_info: result.searchInfo,
        finish_reason: 'continue'
      }

      this.botContext.bot.sseSender.send(`data: ${JSON.stringify(data)}\n\n`)

      if (result.content) {
        const netKnowledgeList = [
          { question: msg, answer: result.content ?? '' }
        ]
        const netKnowledgeText = netKnowledgeList
          .map(({ question, answer }) => {
            return `### 用户问题:\n${question}\n### 内容：\n${answer}`
          })
          .join('\n')
        const prompt = `
<network_search desc="联网搜索">
  以下是用户问题可能涉及的一些通过联网搜索出的信息以及相关资料。回答问题需要充分依赖这些相关资料。
  <network_search_result>
  ${netKnowledgeText}
  </network_search_result>
</network_search>
      `
        return {
          prompt: prompt,
          result: result
        }
      }
    }

    return {
      prompt: '',
      result: null
    }
  }

  async handleSearchFile ({
    msg,
    files
  }): Promise<ToolCallResult<aitools.SearchFileResult>> {
    if (files?.length === 0 || !this.botContext.info.searchFileEnable) {
      return null
    }

    const result = await this.botContext.bot.tools.searchFile(
      this.botContext.info.botId,
      msg,
      files
    )

    if (result && result.content.length > 0) {
      const data = {
        type: "'search_file',",
        created: Date.now(),
        model: 'hunyuan',
        role: 'assistant',
        content: result.content ?? '',
        finish_reason: 'continue'
      }
      this.botContext.bot.sseSender.send(`data: ${JSON.stringify(data)}\n\n`)

      const fileList = [{ question: msg, answer: result.content ?? '' }]
      const searchFileText = fileList
        .map(({ question, answer }) => {
          return `### 标题:\n${question}\n### 内容：\n${answer}`
        })
        .join('\n')
      const prompt = `
<file_search desc="基于图片或PDF等类型的文件检索">
  以下是用户问题可能涉及的一些通过上传图片或PDF等类型的文件检索出的信息以及相关资料。回答问题需要充分依赖这些相关资料。
  <file_search_result>
  ${searchFileText}
  </file_search_result>
</file_search>
`
      return {
        prompt: prompt,
        result: result
      }
    }

    return {
      prompt: '',
      result: result
    }
  }

  async handleSearchDB ({
    msg
  }): Promise<ToolCallResult<aitools.SearchDBResult>> {
    if (this.botContext.info.databaseModel.length === 0) {
      return null
    }
    const result = await this.botContext.bot.tools.searchDB(
      this.botContext.info.botId,
      msg,
      this.botContext.info.databaseModel
    )

    if (result) {
      const data = {
        type: 'db',
        created: Date.now(),
        role: 'assistant',
        content: '',
        finish_reason: 'continue',
        search_results: {
          relateTables: result.searchResult?.relateTables?.length ?? 0
        }
      }
      this.botContext.bot.sseSender.send(`data: ${JSON.stringify(data)}\n\n`)

      const prompt = `
<db_search desc="数据库查询">
  <db_search_result>
  ${result.searchResult?.answer ?? ''}
  </db_search_result>
</db_search>
`
      return {
        prompt: prompt,
        result: result
      }
    }

    return {
      prompt: '',
      result: result
    }
  }

  async handleSearchKnowledgeBase ({
    msg
  }): Promise<ToolCallResult<aitools.SearchKnowledgeResult>> {
    if (this.botContext?.info?.knowledgeBase?.length === 0) {
      return null
    }

    const result = await this.botContext.bot.tools.searchKnowledgeBase(
      this.botContext.info.botId,
      msg,
      this.botContext.info.knowledgeBase
    )

    if (result?.documents?.length > 0) {
      const documentSetNameList = []
      const fileMetaDataList = []
      result?.documents.forEach(({ Score, DocumentSet }) => {
        if (Score < 0.7) {
          return
        }
        documentSetNameList.push(DocumentSet?.DocumentSetName)
        fileMetaDataList.push(DocumentSet?.FileMetaData)
      })

      // 知识库
      if (documentSetNameList.length !== 0 && fileMetaDataList.length !== 0) {
        const result = {
          type: 'knowledge',
          created: Date.now(),
          role: 'assistant',
          content: '',
          finish_reason: 'continue',
          knowledge_base: Array.from(documentSetNameList),
          knowledge_meta: Array.from(fileMetaDataList)
        }
        this.botContext?.bot?.sseSender?.send(
          `data: ${JSON.stringify(result)}\n\n`
        )
      }

      const highScoreDocuments = result?.documents?.filter(
        ({ Score }) => Score > 0.7
      )

      if (highScoreDocuments.length === 0) {
        return {
          prompt: '',
          result: result
        }
      }

      const knowledgeText = highScoreDocuments
        .map(({ Data }) => {
          return `### 内容：\n${Data.Text}`
        })
        .join('\n')

      const prompt = `
<search_knowledge_base desc="知识库检索">
  以下是用户问题可能涉及的一些背景知识和相关资料，。回答问题需要充分依赖这些背景知识和相关资料。请优先参考这部分内容。
  <knowledge_base_result>
  ${knowledgeText}
  </knowledge_base_result>
</search_knowledge_base>
      `
      return {
        prompt: prompt,
        result: result
      }
    }

    return {
      prompt: '',
      result: result
    }
  }

  async speechToText(input: SpeechToTextInput): Promise<any> {
    console.log(input);

    // const token = getAccessToken(this.botContext.context);
    // const url = `${getOpenAPIBaseURL(this.botContext.context)}/v1/aibot/tool/speech-to-text`;
    // const fetchRes = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     accept: 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     botId: this.botContext.info.botId,
    //     engSerViceType: input.engSerViceType,
    //     voiceFormat: input.voiceFormat,
    //     url: input.url,
    //   }),
    // });

    // const resData = await fetchRes.json();
    // return resData;
  }

  async textToSpeech(input: TextToSpeechInput): Promise<any> {
    console.log(input);
    // const token = getAccessToken(this.botContext.context);
    // const url = `${getOpenAPIBaseURL(this.botContext.context)}/v1/aibot/tool/text-to-speech`;
    // const fetchRes = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     accept: 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     botId: this.botContext.info.botId,
    //     text: input.text,
    //     voiceType: input.voiceType,
    //   }),
    // });
    // const resData = await fetchRes.json();
    // return resData;
  }

  async getTextToSpeechResult(input: GetTextToSpeechResultInput): Promise<any> {
    console.log(input);
    // const token = getAccessToken(this.botContext.context);
    // // eslint-disable-next-line max-len
    // const url = `${getOpenAPIBaseURL(this.botContext.context)}/v1/aibot/tool/text-to-speech?botId=${this.botContext.info.botId}&taskId=${input.taskId}`;
    // const fetchRes = await fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     accept: 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    // const resData = await fetchRes.json();
    // return resData;
  }
}
