export const getAuthHeader = () => {
  return { Authorization: "Bearer " + localStorage.getItem("jwt") };
};

export const fetchChats = async () => {
  const CHATS_URL = "http://localhost:8080/api/v3/chats";
  const response = await fetch(CHATS_URL, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const chats = await response.json();
  return chats;
};
