import React, { createContext, useReducer } from "react";
import { State, Action } from "./types";
import reducer from "./reducer";
import { initState } from "../constants";

interface ContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const Context = createContext<ContextProps>({
  state: initState,
  dispatch: () => {},
});

const AppContext = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export default AppContext;
