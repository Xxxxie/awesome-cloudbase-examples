import { AgentConfig } from "./agent_config";
import { McpServer } from "./mcp";

export class AgentInfo {
  type!: string;
  agentId: string;
  name: string;
  agentSetting: string;
  introduction: string;
  initQuestions!: string[];
  searchNetworkEnable: boolean;
  searchFileEnable: boolean;
  knowledgeBase: string[];
  databaseModel: string[];
  mcpServerList: McpServer[];


  constructor(agentId: string, agentConfig: AgentConfig) {
    this.agentId = agentId;
    this.name = agentConfig.name;
    this.agentSetting = agentConfig.agentSetting;
    this.introduction = agentConfig.introduction;
    this.searchNetworkEnable = agentConfig.searchNetworkEnable;
    this.searchFileEnable = agentConfig.searchFileEnable;
    this.databaseModel = agentConfig.databaseModel;
    this.knowledgeBase = agentConfig.knowledgeBase;
    this.mcpServerList = agentConfig.mcpServerList;
  }
}
