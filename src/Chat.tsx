import { useContext, useState } from "react";
import { useChat } from "./useChat";
import { Switch } from "@headlessui/react";

import { Tab } from "@headlessui/react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { BlocksContext } from "./useBlocks";

export const Chat = ({ className }: { className: string }) => {
  const [use4, setUse4] = useState<boolean>(false);
  const chat = useChat(use4);
  const { fetchChatCompletions, nonSystemMessages } = chat;

  function sendMessage(value: string) {
    fetchChatCompletions(value);
    return;
  }

  const { blocks } = useContext(BlocksContext);

  return (
    <Tab.Group as="div" className={["relative", className].join(" ")}>
      <Tab.List
        as="div"
        className="flex p-2 items-center text-sm bg-regal-violet text-white divide-x"
      >
        <Tab className="font-medium px-2 tracking-tight">Log</Tab>
        <Tab className="font-medium px-2 tracking-tight">Saved</Tab>
      </Tab.List>
      <Tab.Panels as="div" className="overflow-auto">
        <Tab.Panel as={MessageList} items={nonSystemMessages} />
        <Tab.Panel as={MessageList} items={blocks} />
      </Tab.Panels>
      <div className="p-4 bg-slate-100 w-full">
        <ChatInput sendMessage={sendMessage} />
        <div className="flex">
          <Switch
            checked={use4}
            onChange={setUse4}
            as="div"
            className="cursor-pointer flex text-xs pt-2 items-center gap-2 text-slate-500 justify-end"
          >
            <div className="flex-shrink-0">Use GPT-4</div>
            <input readOnly type="checkbox" checked={use4} />
          </Switch>
        </div>
      </div>
    </Tab.Group>
  );
};
