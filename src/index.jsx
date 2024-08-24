import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import AppContext from "./context/index.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppContext>
    <App />
  </AppContext>
);
