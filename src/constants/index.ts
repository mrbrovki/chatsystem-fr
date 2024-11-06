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


export interface AuthResponse{
  username: string;
  avatar: string;
}

export const initState: State = {
  username: "",
  avatar: "",
  currentChat: null,
  privateChats: [],
  groupChats: [],
  botChats: [],
  infoChats: [],
  infoMessages: {},
  panelMode: PanelMode.USER_CHATS,
  messages: {
    private: {},
    group: {},
    bot: {}
  }
};
export const WEBSOCKET = import.meta.env.VITE_API_WEBSOCKET;
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const MESSAGES_ROUTE = import.meta.env.VITE_API_MESSAGES_ROUTE;
export const FILES_ROUTE = import.meta.env.VITE_API_FILES_ROUTE
export const CHATS_ROUTE = import.meta.env.VITE_API_CHATS_ROUTE;
export const AUTH_ROUTE = import.meta.env.VITE_API_AUTH_ROUTE;
export const USERS_ROUTE = import.meta.env.VITE_API_USERS_ROUTE;
export const INFO_ROUTE = import.meta.env.VITE_API_INFO_ROUTE;