import { ChatType, Chat, Action, MessageType, ActionType, InfoChat } from "../context/types";



export const getChatName = (chat: Chat | InfoChat) => {
  switch (chat.type) {
    case ChatType.PRIVATE:
      return chat.username;
    case ChatType.BOT:
      return chat.botName;
    case ChatType.GROUP:
      return chat.id;
    case "info":
      return chat.name;
  }
}

export const saveFile = (
    dispatch: React.Dispatch<Action>, 
    data: Blob | File,
    senderId: string,
    chatType: ChatType,
    chatId: string
  ) => {
    const objectURL = URL.createObjectURL(data);
    const message = {
      timestamp: Date.now(),
      content: objectURL,
      type: data.type as MessageType,
      senderId,
    };
    dispatch({
      type: ActionType.ADD_MESSAGE,
      payload: {
        chatType: chatType,
        chatId: chatId,
        message: message,
      },
    });
  };


export const padZero = (num:number) => {
    return num < 10 ? '0' + num : num;
}

export const isMobile = () => {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}