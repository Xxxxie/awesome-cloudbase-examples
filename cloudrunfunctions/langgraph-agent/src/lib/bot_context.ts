import { AgentWrapper } from '../bot'
import { BotInfo } from './bot_info';
import { TcbContext } from './tcb';
import { BotConfig } from './bot_config';

export class BotContext<StateT> {
  context: TcbContext
  config!: BotConfig;
  bot!: AgentWrapper;
  info!: BotInfo;
  state: StateT;

  constructor(context: TcbContext, state: StateT) {
    this.context = context;
    this.state = state;
  }
}