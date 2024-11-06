
import { AUTH_ROUTE, BASE_URL, CHATS_ROUTE, FILES_ROUTE, INFO_ROUTE, LoginFormData, MESSAGES_ROUTE, SignupFormData, USERS_ROUTE } from "../constants";
import { Messages, Chats, GroupChat, PrivateChat, ChatType, BotChat } from "../context/types";

enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  GET = "GET",
  DELETE = "DELETE",
  PATCH = "PATCH"
}
interface FetchRequestOptions extends RequestInit {
  headers?: HeadersInit;
  body?: any;
  method?: HttpMethod;
  signal?: AbortSignal;
}

const fetchRequest = async (url: string, options?: FetchRequestOptions, error?:any): Promise<Response> => {
  const method = options?.method ? options.method : HttpMethod.GET;
  const body = options?.body;
  error = error? error: (str:string) => {throw new Error(`Request failed with status: ${str}`)};
  const signal = options?.signal;

  const response = await fetch(url, {
    method,
    headers: options?.headers,
    body,
    signal,
    credentials: "include"
  });

  if (!response.ok) {
    error(response.status);
  }

  return response;
};

export const getAllChats = async ():Promise<Chats> => {
  const url = `${BASE_URL}${CHATS_ROUTE}`;
  const options = {
    method: HttpMethod.GET,
    headers: {
      'Content-Type': 'application/json',
    }
  }
  const response = await fetchRequest(url, options);
  return response.json();
};

export const getPrivateChats = async ():Promise<PrivateChat[]> => {
  const url = `${BASE_URL}${CHATS_ROUTE}/private`;
  const response = await fetchRequest(url);
  return response.json();
};

export const getBotChats = async ():Promise<BotChat[]> => {
  const url = `${BASE_URL}${CHATS_ROUTE}/bots`;
  const response = await fetchRequest(url);
  return response.json();
};

export const getGroupChats = async ():Promise<GroupChat[]> => {
  const url = `${BASE_URL}${CHATS_ROUTE}/groups`;
  const response = await fetchRequest(url);
  return response.json();
};

export const getPrivateChatByName = async (username: string):Promise<PrivateChat> => {
  const url = `${BASE_URL}${CHATS_ROUTE}/private/${username}`;
  const response = await fetchRequest(url);
  return response.json();
};

export const getGroupById = async (groupId: string): Promise<GroupChat> => {
  const url = `${BASE_URL}${CHATS_ROUTE}/groups/${groupId}`;
  const response = await fetchRequest(url);
  return response.json();
};

export const authenticate = async () => {
  const url = `${BASE_URL}${AUTH_ROUTE}/authenticate`;
  const options = {
    method: HttpMethod.POST,
  };
  const error = () => {
    console.log("not authenticated")
  }
  const response = await fetchRequest(url, options, error);
  return response.json();
};

export const login = async (formData: LoginFormData) => {
  const url = `${BASE_URL}${AUTH_ROUTE}/login`;
  const options = {
    method: HttpMethod.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({...formData}),
  };
  const response = await fetchRequest(url, options);
  return response.json();
}

export const demoLogin = async () => {
  const url = `${BASE_URL}${AUTH_ROUTE}/demo`;
  const options = {
    method: HttpMethod.POST,
    headers: {
      'Content-Type': 'application/json',
    }
  }
  const response = await fetchRequest(url, options);
  return response.json();
}

export const signup = async (formData: SignupFormData) => {
  const url = `${BASE_URL}${AUTH_ROUTE}/signup`;
    const { username, email, password } = formData;
    const options = {
    method: HttpMethod.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  };
  const response = await fetchRequest(url, options);
  return response.text();
}

export const editUser = async (formData: FormData) => {
  const url = `${BASE_URL}${USERS_ROUTE}/edit`;
  const options = {
    method: HttpMethod.PUT,
    body: formData,
  };
  const response = await fetchRequest(url, options);
  return response.json();
}

export const createGroup = async (formData: FormData) => {
  const url = `${BASE_URL}${CHATS_ROUTE}/groups`;
  const options = {
    method: HttpMethod.POST,
    body: formData,
  };

  const response = await fetchRequest(url, options);
  return response.json();
}

export const addNewFriend = async (username: string) => {
  const url = `${BASE_URL}${CHATS_ROUTE}/private/add`;
  const options = {
    method: HttpMethod.POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({chatName: username}),
  };
  const response = await fetchRequest(url, options);
  return response;
}

export const getAllUsers = async (): Promise<PrivateChat[]>  => {
  const url = `${BASE_URL}${USERS_ROUTE}`;
  const response = await fetchRequest(url);
  return response.json();
}

export const getMessages = async (): Promise<Messages> => {
    const url = `${BASE_URL}${MESSAGES_ROUTE}`;
    const response = await fetchRequest(url);
    return response.json();
  };

interface FileParams{
  chatType: ChatType; 
  chatName: string;
  senderName: string;
}

export const getFileById = async (id: string, params:FileParams): Promise<Blob> => {
  const {chatType, chatName, senderName} = params;
  const url = `${BASE_URL}${FILES_ROUTE}/${id}?chatType=${chatType == ChatType.PRIVATE? chatType: chatType + "s"}&chatName=${chatName}&senderName=${senderName}`;
  const response = await fetchRequest(url);
  return response.blob();
}

export const updateReadStatus = async (chatType: ChatType, chatName: string) => {
  const url = `${BASE_URL}${MESSAGES_ROUTE}/${chatType == ChatType.PRIVATE? chatType: chatType + "s"}/${chatName}/status`;
  const options = {
    method: HttpMethod.PUT,
    headers: {
      "Content-Type": "application/json",
    }
  };
  const response = await fetchRequest(url, options);
  return response;
}

export const doesUserExist = async(username: string, signal: AbortSignal) => {
  const url = `${BASE_URL}${USERS_ROUTE}/exists?username=${username}`;
  const options = {
    method: HttpMethod.GET,
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  };
  const error = (str: string) => {
    console.log(str);
  }
  const response = await fetchRequest(url, options, error);
  return response;
}

export const logout = async () => {
 const url = `${BASE_URL}${AUTH_ROUTE}/logout`;
 const options = {
  method: HttpMethod.POST
 };
 const error = () => {};
 const response = await fetchRequest(url, options, error);
 return response;
}

export const deleteAccount = async () => {
  const url = `${BASE_URL}${USERS_ROUTE}/delete`;
  const options = {
    method: HttpMethod.DELETE,
  };
  const response = await fetchRequest(url, options);
  return response;
}

export const getChatMessages = async (chatType: string, chatName: string) => {
 const url = `${BASE_URL}${MESSAGES_ROUTE}/${chatType}/${chatName}`;
 const response = await fetchRequest(url);
 return response.json();
}

export const deletePrivateChat = async (username: string, isForBoth: boolean) => {
  const url = `${BASE_URL}${CHATS_ROUTE}/private/delete?username=${username}&isBoth=${isForBoth}`;
  const options = {
    method: HttpMethod.DELETE,
  };
  const response = await fetchRequest(url, options);
  return response;
}

export const getInfo = async () => {
  const url = `${BASE_URL}${INFO_ROUTE}`;
  const response = await fetchRequest(url);
  return response.json();
}