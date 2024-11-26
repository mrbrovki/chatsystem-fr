export enum MessageType {
  JOIN = "join",
  LEAVE = "leave",
  STATE = "state",
  SVG = "image/svg+xml",
  IMAGE_JPEG = "image/jpeg",
  IMAGE_PNG = "image/png",
  IMAGE_GIF = "image/gif",
  APPLICATION_PDF = "application/pdf",
  APPLICATION_JSON = "application/json",
  VIDEO_AVI = "video/avi",
  VIDEO_MOV = "video/mov",
  VIDEO_MP4 = "video/mp4",
  VIDEO_WEBM = "video/webm",
  TEXT = "text/plain"
}

export enum ChatType{
  PRIVATE="private", GROUP="group", BOT="bot"
}

export enum ChatState{
  TYPING="TYPING", NONE="NONE", ONLINE="ONLINE"
}

export interface InfoChat{
  name: string;
  image: string;
  type: "info";
  unreadCount: number;
  lastReadTime: number;
  state: ChatState;
  id: string;
}

export interface PrivateChat{
  username: string;
  avatar: string;
  type: ChatType.PRIVATE;
  unreadCount: number;
  lastReadTime: number;
  state: ChatState;
  id: string;
}

export interface BotChat{
  botName: string;
  avatar: string;
  type: ChatType.BOT; 
  unreadCount: number;
  lastReadTime: number;
  state: ChatState;
  id: string;
}

export interface GroupChat{
  id: string;
  members?: string[];
  image: string;
  name: string;
  type: ChatType.GROUP;
  host?: string;
  unreadCount: number;
  lastReadTime: number;
  state: ChatState;
}

export interface Message{
  type: MessageType;
  content: string;
  timestamp: number;
  senderId: string;
  link?: string;
} 

export interface Messages{
  [ChatType.PRIVATE]: {
    [id: string]: Message[]
  },
  [ChatType.GROUP]: {
    [id: string]: Message[]
  },
  [ChatType.BOT]: {
    [id: string]: Message[]
  }
}
export interface InfoMessages{
  [id: string]: InfoMessage[]
}

export interface InfoMessage{
  content: string;
  senderId: string;
  type: MessageType;
  timestamp?: number;
  link: string;
}

export interface Chats{
  [ChatType.PRIVATE]: PrivateChat[];
  [ChatType.GROUP]: GroupChat[];
  [ChatType.BOT]: BotChat[];
}

export type Chat = GroupChat | PrivateChat | BotChat;

export enum PanelMode{
  USER_CHATS, CREATE_CHAT, EDIT_PROFILE, CREATE_GROUP, SETTINGS
}
export enum ActionType{
  USER_ID, USERNAME, AVATAR, CURRENT_CHAT, PRIVATE_CHATS, ADD_PRIVATE_CHAT, GROUP_CHATS, ADD_GROUP_CHAT, BOT_CHATS, ADD_BOT_CHAT, PANEL_MODE, RESET, MESSAGES, ADD_MESSAGE, REPLACE_MESSAGE, CHAT_MESSAGES, ADD_PRIVATE_UNREAD, ADD_BOT_UNREAD, ADD_GROUP_UNREAD, RESET_UNREAD, INFO_CHATS, INFO_MESSAGES, MODAL_MODE, CHAT_STATE
}

export interface State {
  username: string;
  userId: string;
  avatar: string,
  currentChat: Chat | InfoChat |null;
  privateChats: PrivateChat[];
  groupChats: GroupChat[];
  botChats: BotChat[];
  panelMode: PanelMode;
  messages: Messages;
  infoChats: InfoChat[];
  infoMessages: InfoMessages;
  modal: ModalProps;
}

interface ADD_MESSAGE_PAYLOAD{
  chatType: ChatType;
  chatId: string;
  message: Message;
}

interface REPLACE_MESSAGE_PAYLOAD{
  chatType: ChatType,
  chatId: string
  index: number;
  message: Message;
}

interface REPLACE_CHAT_MESSAGES{
  chatType: ChatType;
  chatMessages: Message[];
  chatId: string;
}

interface UNREAD_PAYLOAD{
  chatId: string;
}

export enum ModalMode{
  NOTIFICATION, CONFIRM, DELETE, NONE
}

interface ModalProps{
  mode: ModalMode,
  content: string,
  buttons?: any
}

export type Action =
  | { type: ActionType.USERNAME; payload: string }
  | { type: ActionType.USER_ID, payload: string }
  | { type: ActionType.AVATAR; payload: string }
  | { type: ActionType.CURRENT_CHAT; payload: Chat | InfoChat |null }
  | { type: ActionType.PRIVATE_CHATS; payload: PrivateChat[] }
  | { type: ActionType.GROUP_CHATS; payload: GroupChat[] }
  | { type: ActionType.BOT_CHATS; payload: BotChat[] }
  | { type: ActionType.ADD_PRIVATE_CHAT; payload: PrivateChat }
  | { type: ActionType.ADD_GROUP_CHAT; payload: GroupChat }
  | { type: ActionType.ADD_BOT_CHAT; payload: BotChat }
  | { type: ActionType.PANEL_MODE; payload: PanelMode}
  | { type: ActionType.MESSAGES, payload: Messages}
  | { type: ActionType.ADD_MESSAGE, payload: ADD_MESSAGE_PAYLOAD}
  | { type: ActionType.CHAT_MESSAGES, payload: REPLACE_CHAT_MESSAGES}
  | { type: ActionType.REPLACE_MESSAGE, payload: REPLACE_MESSAGE_PAYLOAD}
  | { type: ActionType.ADD_PRIVATE_UNREAD, payload: UNREAD_PAYLOAD} 
  | { type: ActionType.ADD_BOT_UNREAD, payload: UNREAD_PAYLOAD} 
  | { type: ActionType.ADD_GROUP_UNREAD, payload: UNREAD_PAYLOAD} 
  | { type: ActionType.RESET_UNREAD, payload: UNREAD_PAYLOAD} 
  | { type: ActionType.INFO_CHATS, payload: InfoChat[]}
  | { type: ActionType.INFO_MESSAGES, payload: InfoMessages}
  | { type: ActionType.MODAL_MODE, payload: ModalProps}
  | { type: ActionType.CHAT_STATE, payload: {chatId: string, chatType: ChatType, chatState: ChatState}}
  | { type: ActionType.RESET, payload: null};

export enum BtnPriority{
  PRIMARY, SECONDARY, DANGER
}

export interface DeleteChats{
  privateChats: string[],
  groupChats: string[],
  botChats: string[],
  both: boolean
}