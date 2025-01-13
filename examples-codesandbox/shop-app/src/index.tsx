// index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "neutrix";
import { store } from "./storeExample";
import App from "./App";
import "./styles.css";

Promise.resolve().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </StrictMode>
  );
});
