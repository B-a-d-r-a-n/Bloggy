// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router"; // <-- Import your new router instance
import "./styles/index.css";
// Remove the import for App.css and App.tsx
// import App from './App.tsx'
// import './index.css'

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* Replace <App /> with the RouterProvider */}
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
