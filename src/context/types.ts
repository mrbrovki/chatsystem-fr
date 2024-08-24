export enum MessageType{
  PRIVATE="PRIVATE", GROUP="GROUP", JOIN="JOIN"
}

export enum ChatType{
  PRIVATE="PRIVATE", GROUP="GROUP", BOT="BOT"
}

export interface PrivateChat{
  username: string;
  avatar: string;
  type: ChatType.PRIVATE;
}

export interface BotChat{
  botName: string;
  avatar: string;
  type: ChatType.BOT; 
}

export interface GroupChat{
  id: string;
  members?: string[];
  image: string;
  name: string;
  type: ChatType.GROUP;
  host?: string;
}

export interface Message{
  type: MessageType;
  content: string;
  timestamp: Date;
  senderName: string;
} 
export interface Chats{
  privateChats: PrivateChat[];
  groupChats: GroupChat[];
  botChats: BotChat[];
}

export type Chat = GroupChat | PrivateChat | BotChat;

export enum PanelMode{
  USER_CHATS, CREATE_CHAT, EDIT_PROFILE, CREATE_GROUP
}
export enum ActionType{
  USERNAME, AVATAR, CURRENT_CHAT, PRIVATE_CHATS, ADD_PRIVATE_CHAT, GROUP_CHATS, ADD_GROUP_CHAT, BOT_CHATS, ADD_BOT_CHAT, PANEL_MODE, RESET
}

export interface State {
  username: string;
  avatar: string,
  currentChat: Chat | null;
  privateChats: PrivateChat[];
  groupChats: GroupChat[];
  botChats: BotChat[];
  panelMode: PanelMode;
}

export type Action =
  | { type: ActionType.USERNAME; payload: string }
  | { type: ActionType.AVATAR; payload: string }
  | { type: ActionType.CURRENT_CHAT; payload: Chat }
  | { type: ActionType.PRIVATE_CHATS; payload: PrivateChat[] }
  | { type: ActionType.GROUP_CHATS; payload: GroupChat[] }
  | { type: ActionType.BOT_CHATS; payload: BotChat[] }
  | { type: ActionType.ADD_PRIVATE_CHAT; payload: PrivateChat }
  | { type: ActionType.ADD_GROUP_CHAT; payload: GroupChat }
  | { type: ActionType.ADD_BOT_CHAT; payload: BotChat }
  | { type: ActionType.PANEL_MODE; payload: PanelMode}
  | { type: ActionType.RESET };
