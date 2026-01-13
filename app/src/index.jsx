import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import "./assets/styles/global.css";
import "@coreui/coreui/dist/css/coreui.min.css"

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
