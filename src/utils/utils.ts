import { ChatType, Chat, Action, MessageType, ActionType } from "../context/types";



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
