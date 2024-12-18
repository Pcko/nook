import BuilderLayout from "./components/layout/BuilderLayout";
import Login from "./components/auth/Login";

import './index.css';


import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    <div className={'h-full'}>
      <main className={'h-full'}>
        <Login/>
      </main>
    </div>
    </DndProvider>
  );
}

export default App;