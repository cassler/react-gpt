import ReactMarkdown from "react-markdown";
import launchSolid from "./assets/logo.png";
import {
  ClipboardIcon,
  HeartIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ChatCompletionRequestMessage } from "openai";
import { useCopyToClipboard } from "./useCopyToClipboard";
import { createContext, useContext, useEffect, useState } from "react";
import { BlocksContext } from "./useBlocks";

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

  const blocks = message.content.split(/\n\n/);
  const { addBlock } = useContext(BlocksContext);
  return (
    <div className="grid grid-cols-[min-content,5fr] p-2 py-2 self-start group">
      <h4 className="w-16 font-semibold tracking-tight flex flex-col justify-between gap-2 flex-grow h-full">
        <Avatar role={message.role} />
      </h4>
      <div className="text-sm p-4 space-y-2 self-start bg-white shadow rounded-lg relative group">
        {blocks.map((block, idx) => (
          <div
            className="prose prose-sm text-slate-500 leading-snug p-2 py-1 !-my-0.5 cursor-pointer hover:text-black rounded hover:shadow hover:outline outline-slate-200 outline-1  transition-all duration-100 active:outline-offset-2 active:bg-blue-50/50"
            onClick={() => addBlock({ role: message.role, content: block })}
            key={`block-${idx}`}
          >
            <ReactMarkdown key={idx}>{block}</ReactMarkdown>
          </div>
        ))}
        <div className="opacity-0 group-hover:opacity-100 delay-100 transition-opacity duration-100 flex justify-end absolute bottom-1 right-1 border rounded divide-x bg-white">
          <button className="flex hover:bg-slate-50 hover:text-slate-600  transition-all duration-100 p-1 text-slate-400 items-center tracking-tight font-medium rounded-sm text-xs px-2 gap-1">
            <span>Copy</span>
            <ClipboardIcon
              className="w-4 h-4 group-hover:text-black stroke-slate-400 transition-all duration-100"
              onClick={() => copy(message.content)}
            />
          </button>
          <button className="flex hover:bg-slate-50 hover:text-slate-600 transition-all duration-100  p-1 text-slate-400 items-center tracking-tight font-medium rounded-sm text-xs px-2 gap-1">
            <span>Save</span>
            <StarIcon
              className="w-4 h-4 group-hover:text-black stroke-slate-400 transition-all duration-100"
              onClick={() => copy(message.content)}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
