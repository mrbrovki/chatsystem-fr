import { SignupFormData } from "../constants";
import { Chats, GroupChat, Message, PrivateChat } from "../context/types";

export const getAuthHeader = () => {
  return { Authorization: "Bearer " + localStorage.getItem("jwt") };
};

export const fetchChats = async ():Promise<Chats> => {
  const CHATS_URL = "http://localhost:8080/api/v3/chats";
  const response = await fetch(CHATS_URL, {
    method: "GET",
    headers: getAuthHeader(),
  });
  return response.json();
};

export const fetchPrivateChats = async ():Promise<PrivateChat[]> => {
  const CHATS_URL = "http://localhost:8080/api/v3/chats/private";
  const response = await fetch(CHATS_URL, {
    method: "GET",
    headers: getAuthHeader(),
  });
  return response.json();
};

export const fetchChatById = async (groupId: string): Promise<GroupChat> => {
  const CHAT_URL = "http://localhost:8080/api/v3/chats/groups/" + groupId;
  const response = await fetch(CHAT_URL, {
    method: "GET",
    headers: getAuthHeader(),
  });  
  return response.json();
};

export const fetchAuth = async () => {
  const URL = "http://localhost:8080/api/v3/auth/authenticate";
  const response = await fetch(URL, { method: "GET", headers: getAuthHeader() });
  if(response.ok){
      return response.json();
    }else {
      throw new Error(`Login failed with status: ${response.status}`);
    }
};

export const fetchLogin = async (formData: {username: string, password: string}) => {
  const URL = "http://localhost:8080/api/v3/auth/login";
  const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if(response.ok){
      return response.json();
    }else {
      throw new Error(`Login failed with status: ${response.status}`);
    }
}

export const fetchSignup = async (formData: SignupFormData) => {
  const URL = "http://localhost:8080/api/v3/auth/signup";
    const { username, email, password } = formData;
    const response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
}

export const fetchEditUser = async (formData: FormData) => {
  const URL = "http://localhost:8080/api/v2/users/update";
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });
  return response.json();
}

export const fetchCreateGroup = async (formData: FormData) => {
  const URL = "http://localhost:8080/api/v3/chats/groups";
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });
    
  return response;
}

export const fetchAddNewFriend = async (username: string) => {
  const URL = "http://localhost:8080/api/v3/chats/private/add";
    const response = await fetch(URL, {
      method: "PUT",
      headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ username: username }),
    });
  return response;
}

export const fetchUsers = async (): Promise<PrivateChat[]>  => {
  const ALL_USERS_URL = "http://localhost:8080/api/v2/users";
  const response = await fetch(ALL_USERS_URL, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const json = await response.json();
  return json;
}

export const fetchMessages = async (endpoint: string): Promise<Message[]> => {
    const messagesURL = "http://localhost:8080/api/v2/messages/" + endpoint;
    const response = await fetch(messagesURL, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      })
      const json = await response.json();
    return json;
  };