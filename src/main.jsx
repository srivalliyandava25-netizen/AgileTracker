import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import { queryClient } from "./services/queryClient";
import "./index.css";

import "./style/global.css";
import "./style/board.css";
import "./style/ticket.css";
import "./style/modal.css";
import "./style/form.css";
import "./style/new-ticket.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);