import { act, createContext, useReducer } from "react";

const initState = {username: "", currentChat: {chat: null, type: null}, chats: [], panelMode: "USER_CHATS"};

const reducer = (state, action) => {
  switch (action.type) {
    case "USERNAME": 
      return {...state, username: action.payload};
    case "CURRENT_CHAT":
      return {...state, currentChat: action.payload};
    case "CHATS":{
      return {...state, chats: action.payload};
    }
    case "PANEL_MODE":
      return {...state, panelMode: action.payload};
    default:
      return state;
  }
}

export const Context = createContext({state: initState, dispatch: () => {}});

const AppContext = ({children}) => {
const [state, dispatch] = useReducer(reducer, initState);

return(
   <Context.Provider value={{state, dispatch}}>
   {children}
  </Context.Provider>
);
}

export default AppContext;