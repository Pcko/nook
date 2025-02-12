import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import WebsiteBuilder from "./components/website-builder/WebsiteBuilder";
import NodeEditor from "./components/node-editor/NodeEditor";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WebsiteBuilder/>}/>
                <Route path="/editor/:element" element={<NodeEditor/>}/>
            </Routes>
        </Router>
    );
}

export default App;
