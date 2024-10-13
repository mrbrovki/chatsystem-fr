import { Client } from "@stomp/stompjs";
import { Chat, ChatType } from "../context/types";

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
      "file-type": file.type,
      "receiver-name": receiverName!,
      "content-type": "application/octet-stream",
    },
  });
}