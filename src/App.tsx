import "./App.css";
import { Chat } from "./Chat";
import { BlocksProvider } from "./useBlocks";

function App() {
  return (
    <BlocksProvider>
      <Chat className="rounded-lg h-screen bg-slate-100 grid grid-rows-[50px,1fr,min-content]" />
    </BlocksProvider>
  );
}

export default App;
