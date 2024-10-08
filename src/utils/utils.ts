import { Client } from "@stomp/stompjs";
import { AUTH_ROUTE, BASE_URL, CHATS_ROUTE, FILES_ROUTE, LoginFormData, MESSAGES_ROUTE, SignupFormData, USERS_ROUTE } from "../constants";
import { Messages, Chats, GroupChat, PrivateChat, ChatType, Chat, Action, MessageType, ActionType } from "../context/types";

export const jwtAuthHeader = () => ({ Authorization: "Bearer " + sessionStorage.getItem("jwt") });

enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  GET = "GET",
  DELETE = "DELETE",
  PATCH = "PATCH"
}

export const fetchAllChats = async ():Promise<Chats> => {
  const url = `${BASE_URL}${CHATS_ROUTE}`;
  const options = {
    headers: {
      ...jwtAuthHeader()
    }
  };
  const response = await fetchRequest(url, options);
  return response.json();
};

export const fetchPrivateChats = async ():Promise<PrivateChat[]> => {
  const url = `${BASE_URL}${CHATS_ROUTE}/private`;
  const options = {
    headers: {
      ...jwtAuthHeader()
    }
  };
  const response = await fetchRequest(url, options);
  return response.json();
};

export const fetchPrivateChatByName = async (username: string):Promise<PrivateChat> => {
  const url = `${BASE_URL}${CHATS_ROUTE}/private/${username}`;
  const options = {
    headers: {
      ...jwtAuthHeader()
    }
  };
  const response = await fetchRequest(url, options);
  return response.json();
};

export const fetchGroupById = async (groupId: string): Promise<GroupChat> => {
  const url = `${BASE_URL}${CHATS_ROUTE}/groups/${groupId}`;
  const options = {
    headers: {
      ...jwtAuthHeader()
    }
  };
  const response = await fetchRequest(url, options);
  return response.json();
};

export const fetchAuth = async () => {
  const url = `${BASE_URL}${AUTH_ROUTE}/authenticate`;
  const options = {
    headers: {
      ...jwtAuthHeader()
    },
    method: HttpMethod.POST,
  };
  const error = () => {
    sessionStorage.removeItem("jwt");
  }
  const response = await fetchRequest(url, options, error);
  return response.json();
};

export const fetchLogin = async (formData: LoginFormData) => {
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

export const fetchSignup = async (formData: SignupFormData) => {
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

export const fetchEditUser = async (formData: FormData) => {
  const url = `${BASE_URL}${USERS_ROUTE}/update`;
  const options = {
    headers: {
      ...jwtAuthHeader(),
    },
    method: HttpMethod.PUT,
    body: formData,
  };
  const response = await fetchRequest(url, options);
  return response.json();
}

export const fetchCreateGroup = async (formData: FormData) => {
  const url = `${BASE_URL}${CHATS_ROUTE}/groups`;
  const options = {
    headers: {
      ...jwtAuthHeader(),
    },
    method: HttpMethod.POST,
    body: formData,
  };

  const response = await fetchRequest(url, options);
  return response.json();
}

export const fetchAddNewFriend = async (username: string) => {
  const url = `${BASE_URL}${CHATS_ROUTE}/private/add`;
  const options = {
    method: HttpMethod.PUT,
    headers: {
      ...jwtAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username}),
  };
  const response = await fetchRequest(url, options);
  return response;
}

export const fetchUsers = async (): Promise<PrivateChat[]>  => {
  const url = `${BASE_URL}${USERS_ROUTE}`;
  const options = {
    headers: {
      ...jwtAuthHeader()
    }
  };
  const response = await fetchRequest(url, options);
  return response.json();
}

export const fetchMessages = async (): Promise<Messages> => {
    const url = `${BASE_URL}${MESSAGES_ROUTE}`;
    const options = {
    headers: {
      ...jwtAuthHeader()
    }
  };
    const response = await fetchRequest(url, options);
    return response.json();
  };

interface FileParams{
  chatType: ChatType; 
  chatName: string;
  senderName: string;
}

export const fetchFileById = async (id: string, params:FileParams): Promise<Blob> => {
  const {chatType, chatName, senderName} = params;
  const url = `${BASE_URL}${FILES_ROUTE}/${id}?chatType=${chatType}&chatName=${chatName}&senderName=${senderName}`;
  const options = {
    headers: {
      ...jwtAuthHeader()
    }
  };
  const response = await fetchRequest(url, options);
  return response.blob();
}

export const fetchUpdateReadStatus = async (chatType: ChatType, chatName: string) => {
  const url = `${BASE_URL}${MESSAGES_ROUTE}/${chatType}/${chatName}/status`;
  const options = {
    method: HttpMethod.PUT,
    headers: {
      ...jwtAuthHeader(),
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
  });

  if (!response.ok) {
    error(response.status);
  }

  return response;
};

export const getChatName = (chat: Chat) => {
  switch (chat.type) {
    case ChatType.PRIVATE:
      return chat.username;
    case ChatType.BOT:
      return chat.botName;
    case ChatType.GROUP:
      return chat.id;
  }
}

export const sendFile = async (file: File, chat: Chat, receiverName: string, stompClient: Client | null) => {
  const buffer = new Uint8Array(await file.arrayBuffer());
  let url;
  switch (chat.type) {
    case ChatType.PRIVATE:
      url = "/app/chat.sendFileToPrivate";
      break;
    case ChatType.BOT:
      url = "/app/chat.sendFileToBot";
      break;
    case ChatType.GROUP:
      url = "/app/chat.sendFileToGroup";
      break;
  }

  if (!stompClient) return;
  stompClient.publish({
    destination: url!,
    binaryBody: buffer,
    headers: {
      ...jwtAuthHeader(),
      "file-type": file.type,
      "receiver-name": receiverName!,
      "content-type": "application/octet-stream",
    },
  });
}

export const saveFile = (
    dispatch: React.Dispatch<Action>, 
    data: Blob | File,
    senderName: string,
    chatType: ChatType,
    chatName: string
  ) => {
    const objectURL = URL.createObjectURL(data);
    const message = {
      timestamp: Date.now(),
      content: objectURL,
      type: data.type as MessageType,
      senderName: senderName,
    };
    dispatch({
      type: ActionType.ADD_MESSAGE,
      payload: {
        chatType: chatType,
        chatName: chatName,
        message: message,
      },
    });
  };