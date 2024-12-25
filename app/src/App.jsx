import Login from "./components/auth/Login";
import VisualEditor from "./components/node-editor/VisualEditor";
import './index.css';

function App() {
  return (
    <div className={'h-full'}>
      <main className={'h-full'}>
        <VisualEditor/>
      </main>
    </div>
  );
}

export default App;