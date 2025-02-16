import EditorHub from "./components/builder-hub/EditorHub";
import {BuilderProvider} from "./components/builder-hub/BuilderContext";

function App() {
    return (
        <BuilderProvider>
            <EditorHub />
        </BuilderProvider>
    );
}

export default App;