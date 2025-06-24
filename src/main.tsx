import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";
import { ExerciseProvider } from "./context/ExerciseContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/gymapp">
      <ExerciseProvider>
        <App />
      </ExerciseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
