import { initState } from '../constants';
import { State, Action, ActionType } from './types';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.USERNAME: 
      return { ...state, username: action.payload };
    case ActionType.AVATAR:
      return { ...state, avatar: action.payload +  `?timestamp=${new Date().getTime()}`};
    case ActionType.CURRENT_CHAT:
      return { ...state, currentChat: action.payload };
    case ActionType.PRIVATE_CHATS:
      return { ...state, privateChats: action.payload };
    case ActionType.GROUP_CHATS:
      return { ...state, groupChats: action.payload };
    case ActionType.BOT_CHATS:
      return { ...state, botChats: action.payload };

    case ActionType.ADD_PRIVATE_CHAT:
      return { ...state, privateChats: [...state.privateChats, action.payload]};
    case ActionType.ADD_GROUP_CHAT:
      return { ...state, groupChats: [...state.groupChats, action.payload]};
    case ActionType.ADD_BOT_CHAT:
      return { ...state, botChats: [...state.botChats, action.payload]};

    case ActionType.PANEL_MODE:
      return { ...state, panelMode: action.payload };
    case ActionType.RESET:{
      return initState;
    }
    default:
      return state;
  }
};

export default reducer;
