import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./global.css";
import TodoManager from "./TodoManager";
import { TodoProvider } from "./contexts/TodoContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TodoProvider>
      <TodoManager></TodoManager>
    </TodoProvider>
  </StrictMode>
);
