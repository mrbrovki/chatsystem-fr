import { createContext, useReducer } from "react";

const initState = {username: ""};

const reducer = (state, action) => {
  switch (action.type) {
   case "USERNAME": 
    return {...state, username: action.payload};
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