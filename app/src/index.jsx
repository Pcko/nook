import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import initSentry from "./app/bootstrap/sentry";
import "./index.css";
import "./assets/styles/global.css";

initSentry();

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
