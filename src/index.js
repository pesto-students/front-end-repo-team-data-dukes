import React from "react";
import ReactDOM from "react-dom/client";

import reportWebVitals from "./reportWebVitals";
import App from "./app/App";

import "./styles/font.css";
import "./styles/main.css";
import "./styles/common.css";
import "./styles/antd.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/shared-connection-worker.js")
    .then((serviceWorker) => {
      console.log("Service Worker registered: ", serviceWorker);
    })
    .catch((error) => {
      console.error("Error registering the Service Worker: ", error);
    });
}
