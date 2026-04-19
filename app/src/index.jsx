import ReactDOM from "react-dom/client";

import initSentry from "./app/bootstrap/sentry";
import App from "./App.jsx";
import "./index.css";
import "./assets/styles/global.css";

initSentry();

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
