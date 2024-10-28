import 'styled-components';
import { BtnPriority } from './context/types';


declare module 'styled-components' {
  export interface DefaultTheme {
    breakpoints: {
     mobile: string,
     tablet: string,
     desktop: string,
   }, 
   colors: {
    text: string,
    sidebar: string,
    panel: {
      background: string,
    },
    chat: {
      background: string,
      header: string,
    }
    message: {
      self: {
        background: string,
        text: string,
      }
      other: {
        background: string,
        text: string,
      }
    }
    auth: {
      background: string,
    }
    main: {
      background: string,
    },
    buttons: Record<BtnPriority, {
        border: string,
        background: string;
        text: string,
        hover: {
          border: string,
          background: string,
          text: string,
        },
      }>,
      input: Record<"primary" | "secondary", {
        outline: string,
        background: string,
        text: string,
        placeholder: string,
        error: string,
        label: string,
        focus: string,
      }>
   }
  }
}