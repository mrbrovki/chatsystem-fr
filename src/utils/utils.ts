import { AUTH_ROUTE, BASE_URL, CHATS_ROUTE, FILES_ROUTE, LoginFormData, MESSAGES_ROUTE, SignupFormData, USERS_ROUTE } from "../constants";
import { Messages, Chats, GroupChat, PrivateChat, ChatType } from "../context/types";

export const jwtAuthHeader = () => ({ Authorization: "Bearer " + localStorage.getItem("jwt") });

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
    localStorage.removeItem("jwt");
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
    body: {...formData},
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
    body: { username, email, password },
  };
  const response = await fetchRequest(url, options);
  return response.text();
}

export const fetchEditUser = async (formData: FormData) => {
  const url = `${BASE_URL}${USERS_ROUTE}/update`;
  const options = {
    headers: {
      ...jwtAuthHeader(),
      "Content-Type": "application/json",
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
      "Content-Type": "application/json",
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
    body: {username},
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

interface FetchRequestOptions extends RequestInit {
  headers?: HeadersInit;
  body?: any;
  method?: HttpMethod;
}

const fetchRequest = async (url: string, options?: FetchRequestOptions, error?:any): Promise<Response> => {
  const method = options?.method ? options.method : HttpMethod.GET;
  const body = options?.body? JSON.stringify(options.body): undefined;
  error = error? error: (str:string) => {throw new Error(`Request failed with status: ${str}`)};

  const response = await fetch(url, {
    method,
    headers: options?.headers,
    body
  });

  if (!response.ok) {
    error(response.status);
  }

  return response;
};
