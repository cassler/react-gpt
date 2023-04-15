import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { useChat } from "./useChat";
import launchSolid from "./assets/logo.png";
import { Switch, Transition } from "@headlessui/react";
import {
  UserIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import { ChatCompletionRequestMessage } from "openai";
import { useCopyToClipboard } from "./useCopyToClipboard";

export function Avatar({
  role,
}: {
  role: ChatCompletionRequestMessage["role"];
}) {
  if (role === "assistant") {
    return <img src={launchSolid} className="w-12" alt={role} />;
  } else {
    return (
      <UserIcon
        className="rounded-sm  from-regal-violet via-savage-magenta to-optimistic-orange p-2 w-12 h-12 text-white border-regal-violet bg-gradient-to-br"
        aria-label={role}
      />
    );
  }
}

export const ChatBubble = ({
  message,
}: {
  message: ChatCompletionRequestMessage;
}) => {
  const [value, copy] = useCopyToClipboard();
  return (
    <div className="grid grid-cols-[min-content,5fr] p-2 py-2 self-start group">
      <h4 className="w-16 font-semibold tracking-tight flex flex-col justify-between gap-2 flex-grow h-full">
        <Avatar role={message.role} />
      </h4>
      <div className="text-sm p-4 space-y-3 leading-snug self-start prose prose-sm prose-slate prose-headings:text-pink-700 bg-white shadow rounded-lg">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
};

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
