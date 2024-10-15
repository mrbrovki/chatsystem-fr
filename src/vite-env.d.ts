// vite-env.d.ts

interface ImportMeta {
  env: {
    VITE_API_BASE_URL: string;
    VITE_API_MESSAGES_ROUTE: string;
    VITE_API_FILES_ROUTE: string;
    VITE_API_CHATS_ROUTE: string;
    VITE_API_AUTH_ROUTE: string;
    VITE_API_USERS_ROUTE: string;
  };
}
