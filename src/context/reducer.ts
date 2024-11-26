import { initState } from '../constants';
import { State, Action, ActionType, Message, ChatType } from './types';

const reducer = (state: State, action: Action): State => {
  const {type, payload} = action;
  switch (type) {
    case ActionType.USERNAME: 
      return { ...state, username: payload };
    case ActionType.USER_ID: 
      return {...state, userId: payload};
    case ActionType.AVATAR:
      return { ...state, avatar: payload};
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
      const {chatId, chatType, message} = payload;
      const chatMessages = state.messages[chatType][chatId];
      
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
              [chatId]: newMessages},
        }
      }
    }
    case ActionType.REPLACE_MESSAGE: {
      const {chatId, message, chatType, index} = payload;
      const chatMessages = state.messages[chatType][chatId];
      
      const newMessages = [...chatMessages.slice(0, index), 
        message,
        ...chatMessages.slice(index + 1)];
        
      return{
          ...state, messages: {
            ...state.messages,
            [chatType]: {
              ...state.messages[chatType],
              [chatId]: newMessages},
        }
      }
    }
    case ActionType.CHAT_MESSAGES: {
      const {chatMessages, chatType, chatId} = payload;
      return {
        ...state, messages: {
          ...state.messages,
            [chatType]: {
              ...state.messages[chatType],
              [chatId]: chatMessages
            }
        }
      }
    }

    case ActionType.ADD_PRIVATE_UNREAD:{
      const {chatId} = payload;
      const newPrivateChats = state.privateChats.map((chat) => {
        if(chat.id === chatId){
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
      const {chatId} = payload;
      const newBotChats = state.botChats.map((chat) => {
        if(chat.id === chatId){
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
      const {chatId} = payload;
      const newGroupChats = state.groupChats.map((chat) => {
        if(chat.id === chatId){
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

    case ActionType.CHAT_STATE:{
      const {chatType, chatId, chatState} = payload;

      switch(chatType){
        case ChatType.PRIVATE: {
          const newPrivateChats = state.privateChats.map((chat) => {
            if(chat.id === chatId){
              return {
                ...chat, state: chatState,
              }
            }else{
              return chat;
            }
          })
          if(state.currentChat != null){
            if(state.currentChat.type === ChatType.PRIVATE){
              if(state.currentChat.id === chatId){
                return{
                  ...state, privateChats: newPrivateChats, currentChat: {
                    ...state.currentChat, state: chatState
                  }
                }
              }
            }
          }
          return {
            ...state, privateChats: newPrivateChats
          }
        }
        case ChatType.GROUP: {
          const newGroupChats = state.groupChats.map((chat) => {
            if(chat.id === chatId){
              return {
                ...chat, state: chatState,
              }
            }else{
              return chat;
            }
          })

          if(state.currentChat != null){
            if(state.currentChat.type === ChatType.GROUP){
              if(state.currentChat.id === chatId){
                return{
                  ...state, groupChats: newGroupChats, currentChat: {
                    ...state.currentChat, state: chatState
                  }
                }
              }
            }
          }
          return {
            ...state, groupChats: newGroupChats
          }
        }
        case ChatType.BOT: {
           const newBotChats = state.botChats.map((chat) => {
            if(chat.id === chatId){
              return {
                ...chat, state: chatState,
              }
            }else{
              return chat;
            }
          })
          if(state.currentChat != null){
            if(state.currentChat.type === ChatType.BOT){
              if(state.currentChat.id === chatId){
                return{
                  ...state, botChats: newBotChats, currentChat: {
                    ...state.currentChat, state: chatState
                  }
                }
              }
            }
          }
          return {
            ...state, botChats: newBotChats
          }
        }
      }
      break; 
    }

    case ActionType.INFO_CHATS: {
      return {
        ...state, infoChats: payload
      }
    }
    case ActionType.INFO_MESSAGES: {
      return {
        ...state, infoMessages: payload
      }
    }
    
    case ActionType.MODAL_MODE: {
      return {...state, modal: payload}
    }

    case ActionType.RESET:{
      return initState;
    }
    default:
      return state;
  }
};

export default reducer;
