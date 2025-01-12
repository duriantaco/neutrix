// main.tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { StoreProvider } from 'spyn'
import { store } from './toDoStore'
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </StrictMode>
)