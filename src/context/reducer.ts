import { initState } from '../constants';
import { State, Action, ActionType, Message } from './types';

const reducer = (state: State, action: Action): State => {
  const {type, payload} = action;
  switch (type) {
    case ActionType.USERNAME: 
      return { ...state, username: payload };
    case ActionType.AVATAR:
      return { ...state, avatar: payload +  `?timestamp=${Date.now()}`};
    case ActionType.CURRENT_CHAT:
      return { ...state, currentChat: payload };

    case ActionType.PRIVATE_CHATS:
      return { ...state, privateChats: payload };
    case ActionType.GROUP_CHATS:
      return { ...state, groupChats: payload };
    case ActionType.BOT_CHATS:
      return { ...state, botChats: payload };
    case ActionType.ADD_PRIVATE_CHAT:
      return { ...state, privateChats: [...state.privateChats, payload]};
    case ActionType.ADD_GROUP_CHAT:
      return { ...state, groupChats: [...state.groupChats, payload]};
    case ActionType.ADD_BOT_CHAT:
      return { ...state, botChats: [...state.botChats, payload]};

    case ActionType.PANEL_MODE:
      return { ...state, panelMode: payload };

    case ActionType.MESSAGES:
      return {...state, messages: payload};  
    case ActionType.ADD_MESSAGE:{ 
      const {chatType, chatName, message} = payload;
      const chatMessages = state.messages[chatType][chatName];
      
      let newMessages: Message[];
      if(chatMessages){
        newMessages = [...chatMessages, message];
      }else{
        newMessages = [message];
      }
      return{
          ...state, messages: {
            ...state.messages,
            [chatType]: {
              ...state.messages[chatType],
              [chatName]: newMessages},
        }
      }
    }
    case ActionType.REPLACE_MESSAGE: {
      const {chatType, chatName, message, index} = payload;
      const chatMessages = state.messages[chatType][chatName];
      
      const newMessages = [...chatMessages.slice(0, index), 
        message,
        ...chatMessages.slice(index + 1)];
        
      return{
          ...state, messages: {
            ...state.messages,
            [chatType]: {
              ...state.messages[chatType],
              [chatName]: newMessages},
        }
      }
    }
    case ActionType.CHAT_MESSAGES: {
      const {chatMessages, chatType, chatName} = payload;
      return {
        ...state, messages: {
          ...state.messages,
            [chatType]: {
              ...state.messages[chatType],
              [chatName]: chatMessages
            }
        }
      }
    }

    case ActionType.ADD_PRIVATE_UNREAD:{
      const {chatName} = payload;
      const newPrivateChats = state.privateChats.map((chat) => {
        if(chat.username === chatName){
          return {
            ...chat, unreadCount: chat.unreadCount + 1,
          }
        }else{
          return chat;
        }
      })

      return {
        ...state, privateChats: newPrivateChats
      }
    }

    case ActionType.ADD_BOT_UNREAD:{
      const {chatName} = payload;
      const newBotChats = state.botChats.map((chat) => {
        if(chat.botName === chatName){
          return {
            ...chat, unreadCount: chat.unreadCount + 1,
          }
        }else{
          return chat;
        }
      })

      return {
        ...state, botChats: newBotChats
      }
    }

    case ActionType.ADD_GROUP_UNREAD:{
      const {chatName} = payload;
      const newGroupChats = state.groupChats.map((chat) => {
        if(chat.name === chatName){
          return {
            ...chat, unreadCount: chat.unreadCount + 1,
          }
        }else{
          return chat;
        }
      })

      return {
        ...state, groupChats: newGroupChats
      }
    }

    case ActionType.RESET:{
      return initState;
    }
    default:
      return state;
  }
};

export default reducer;
