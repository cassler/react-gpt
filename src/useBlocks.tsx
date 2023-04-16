import { ChatCompletionRequestMessage } from "openai";
import { createContext, useEffect, useState } from "react";

const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

type Block = ChatCompletionRequestMessage & {
  id: string;
};
export function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const savedBlocks = localStorage.getItem("blocks");
    if (savedBlocks) {
      setBlocks(JSON.parse(savedBlocks));
      console.log("blocks", JSON.parse(savedBlocks));
    }
  }, []);

  useEffect(() => {
    if (blocks.length === 0) return;
    localStorage.setItem("blocks", JSON.stringify(blocks));
    console.log("Saved blocks", blocks);
  }, [blocks]);

  const addBlock = (block: ChatCompletionRequestMessage) => {
    setBlocks((blocks) => [...blocks, { id: generateId(), ...block }]);
  };

  const removeBlock = (id: string) => {
    setBlocks((blocks) => blocks.filter((block) => block.id !== id));
  };

  return { blocks, addBlock, removeBlock } as const;
}

// create context for BlockCOntext
export const BlocksContext = createContext<ReturnType<typeof useBlocks>>(null!);

// ContextProvider for our useBlock hook
export function BlocksProvider({ children }: { children: React.ReactNode }) {
  const ctx = useBlocks();
  return (
    <BlocksContext.Provider value={ctx}>{children}</BlocksContext.Provider>
  );
}
