import { PanelMode, State } from "../context/types";

export enum AuthMode {
  LOGIN,
  SIGNUP,
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

export interface User{
 name: string;
 avatar: string;
}

export const initState: State = {
  username: "",
  avatar: "https://api.multiavatar.com/user1.svg?apiKey=7UHNFoPLjsVJCi",
  currentChat: null,
  privateChats: [],
  groupChats: [],
  botChats: [],
  panelMode: PanelMode.USER_CHATS,
};