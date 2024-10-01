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

export interface LoginFormData {
  username: string;
  password: string;
}

export interface User{
 name: string;
 avatar: string;
}

export const initState: State = {
  username: "",
  avatar: "",
  currentChat: null,
  privateChats: [],
  groupChats: [],
  botChats: [],
  panelMode: PanelMode.USER_CHATS,
  messages: {
    private: {},
    group: {},
    bot: {}
  }
};

export const BASE_URL = "http://localhost:8080";
export const MESSAGES_ROUTE = "/api/v2/messages";
export const FILES_ROUTE = MESSAGES_ROUTE + "/files"
export const CHATS_ROUTE = "/api/v3/chats";
export const AUTH_ROUTE = "/api/v3/auth";
export const USERS_ROUTE = "/api/v3/users";