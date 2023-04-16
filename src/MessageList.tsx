import { Transition } from "@headlessui/react";
import { ChatBubble } from "./ChatBubble";
import { ChatCompletionRequestMessage } from "openai";
import { useChat } from "./useChat";

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

export const MessageList = ({
  items,
}: {
  items: ChatCompletionRequestMessage[];
}) => {
  const { chatLogRef, isLoading, error } = useChat();
  return (
    <Transition as="div" show appear ref={chatLogRef}>
      {error && error.message}
      {items.map((m, idx) => (
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
      {!isLoading && items.length === 0 && <SplashMessage />}
    </Transition>
  );
};
