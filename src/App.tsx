import "./App.css";
import { Chat } from "./Chat";

function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <Chat className="rounded-lg border border-slate-300 shadow w-[700px] h-[90vh] m-auto overflow-clip" />
    </div>
  );
}

export default App;
