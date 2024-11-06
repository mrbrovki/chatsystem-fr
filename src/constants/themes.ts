import { DefaultTheme } from "styled-components/dist/types";
import { BtnPriority } from "../context/types";

export const theme: DefaultTheme = {
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "2048px",
  },
  colors: {
    text: "#333333",
    sidebar: "linear-gradient(to top, #43a5dc, #ff7bac)",
    panel: {
     background: "#fff",
    },
    chat: {
      background: "#fff",
      header: "#fff",
    },
    message: {
      self: {
        background: "#43a5dc",
        text: "#fff",
      },
      other: {
        background: "#d9d9d9",
        text: "#000",
      },
    },
    auth: {
      background: "#ffffff",
    },
    main: {
      background: "#d9d9d9",
    },
    buttons: {
     [BtnPriority.PRIMARY]: {
      border: "#000",
      background: "#000",
      text: "#fff",
      hover: {
       border: "#000",
      background: "#fff",
      text: "#000",
      }
     },
     [BtnPriority.SECONDARY]: {
      border: "#000",
      background: "#fff",
      text: "#000",
      hover: {
       border: "#000",
      background: "#000",
      text: "#fff",
      }
     },
     [BtnPriority.DANGER]: {
      border: "#d60000",
      background: "#fff",
      text: "#d60000",
      hover: {
        border: "#d60000",
        background: "#d60000",
        text: "#fff",
      }
     },
    },
    input: {
      primary: {
        background: "#fff",
        outline: "#d9d9d9",
        text: "black",
        placeholder: "#A8A8A8",
        label: "black",
        error: "red",
        focus: "black",
      }, 
      secondary: {
        background: "#F7F7F7",
        outline: "#F7F7F7",
        text: "black",
        placeholder: "#A8A8A8",
        label: "black",
        error: "red",
        focus: "black",
      }
    }
  },
};

