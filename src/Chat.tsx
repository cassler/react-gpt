import { useState } from "react";
import { useChat } from "./useChat";
import { Switch, Transition } from "@headlessui/react";
import { ChatBubble } from "./ChatBubble";

export const ThinkingNode = () => (
  <Transition
    appear
    unmount={false}
    enter="transition-all ease-linear duration-300"
    enterFrom="opacity-0 scale-95 translate-y-4"
    enterTo="opacity-100 scale-100 translate-y-0"
    leave="transition-opacity duration-0"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="self-center bg-slate-50 animate-pulse  text-black m-1 rounded h-auto items-center flex justify-center">
      <p className="text-sm uppercase p-4 font-light tracking-wide">
        thinking...
      </p>
    </div>
  </Transition>
);
export const SplashMessage = () => (
  <div className="self-center bg-slate-100 h-full items-center flex justify-center">
    <p className="text-2xl p-4 tracking-tight animate-pulse">
      Hi there.
      <br />
      Type a message to get started
    </p>
  </div>
);

export const Chat = ({ className }: { className: string }) => {
  const [use4, setUse4] = useState<boolean>(false);
  const chat = useChat(use4);
  const [value, setValue] = useState<string>("");

  const {
    fetchChatCompletions,
    chatLogRef,
    isLoading,
    error,
    nonSystemMessages,
  } = chat;

  function sendMessage(e: React.SyntheticEvent) {
    e.preventDefault();
    setValue("");
    fetchChatCompletions(value);
    return;
  }
  return (
    <div className={["relative", className].join(" ")}>
      <Transition
        as="div"
        show
        appear
        ref={chatLogRef}
        className="h-[calc(100%-83px)] bg-slate-50 overflow-auto"
      >
        {error && error.message}
        {nonSystemMessages.map((m, idx) => (
          <Transition.Child
            appear
            enter="transition-all ease-linear duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ChatBubble message={m} />
          </Transition.Child>
        ))}
        {isLoading && <ThinkingNode />}
        {!isLoading && nonSystemMessages.length === 0 && <SplashMessage />}
      </Transition>

      <div className="p-2 bg-slate-100 bottom-0 absolute w-full">
        <form
          className="group flex w-full rounded gap-2"
          onSubmit={sendMessage}
        >
          <input
            className="px-4 py-2 focus:outline-none rounded-full flex-grow border group-focus-within:ring-2 ring-savage-magenta"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className="p-2 px-8 font-medium rounded-full text-center text-white bg-gradient-to-r from-regal-violet to-savage-magenta"
            type="submit"
          >
            Send
          </button>
        </form>
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
  );
};
