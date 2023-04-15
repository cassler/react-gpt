import { useState } from "react";
import { useChat } from "./useChat";
import launchSolid from './assets/logo.png'
import { Switch, Transition } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import { ChatCompletionRequestMessage } from "openai";
import {useCopyToClipboard} from './useCopyToClipboard';
// import from heroicons
import { UserIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'

export function Avatar({role}:{role: ChatCompletionRequestMessage['role']}) {
  if (role === 'assistant') {
    return <img src={launchSolid} className='w-12' alt={role} />
  } else {
    return <UserIcon className='rounded-sm bg-pink-600 text-pink-200 w-12 h-12 border-2 border-orange-500' aria-label={role} />
  }
}


export const ChatBubble = ({message}: {message:ChatCompletionRequestMessage}) => {
  const [value, copy] = useCopyToClipboard();
  return (

      <div className='grid grid-cols-[64px,5fr] p-2 py-2 self-start group'>
        <h4 className='w-16 font-semibold tracking-tight p-2'>
          <Avatar role={message.role} />
        </h4>
        <div className='text-sm pr-4 space-y-3 leading-snug prose prose-sm prose-slate prose-headings:text-pink-700 bg-white shadow p-4 rounded-lg'>
          <ReactMarkdown>{message.content}</ReactMarkdown>
          <div className="footer flex gap-2 pt-4 tracking-tight font-light [&_svg]:w-4 text-xs text-slate-400 group-hover:opacity-100 opacity-0 transition-opacity duration-200">
            <button onClick={() => copy(message.content)}>copy</button>
            <button onClick={() => copy(message.content)}>share</button>
            <button onClick={() => copy(message.content)}>save</button>
            <button onClick={() => copy(message.content)}>favorite</button>
            <button onClick={() => copy(message.content)} className='ml-auto'>forget</button>
            <button onClick={() => copy(message.content)}><HandThumbUpIcon /></button>
            <button onClick={() => copy(message.content)}><HandThumbDownIcon /></button>
          </div>
        </div>
      </div>
  )
}

export const ThinkingNode = () => (
  <div className='self-center bg-slate-50 animate-pulse  text-black m-1 rounded h-auto items-center flex justify-center'>
    <p className='text-sm uppercase p-4 font-light tracking-wide'>thinking...</p>
  </div>
)
export const SplashMessage = () => (
  <div className='self-center bg-slate-100 h-full items-center flex justify-center'>
    <p className='text-2xl p-4 tracking-tight animate-pulse'>Hi there.<br />Type a message to get started</p>
  </div>
)

export const Chat = ({className}: {className: string}) => {
  const [use4, setUse4] = useState<boolean>(false)
  const chat = useChat(use4);
  const [value, setValue] = useState<string>('')

  const { fetchChatCompletions,chatLogRef, isLoading, error, nonSystemMessages }  = chat;

  function sendMessage(e:React.SyntheticEvent) {
    e.preventDefault();
    setValue('');
    fetchChatCompletions(value);
    return;
  }
  return (
    <div className={['relative', className].join(' ')}>
      <Transition
        as='div'
        show
        appear
        className='h-[calc(100%-86px)] bg-slate-50 overflow-auto'
        ref={chatLogRef}
      >
        {error && error.message}
        {nonSystemMessages.map((m, idx) =>
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
        )}

        <Transition
            show={isLoading}
            appear
            unmount={false}
            enter="transition-all ease-linear duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition-opacity duration-0"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ThinkingNode />
          </Transition>

        {!isLoading && nonSystemMessages.length === 0 && (<SplashMessage />)}
      </Transition>

      <div className='p-2 bg-slate-100 border-t bottom-0 absolute w-full'>
        <form className='group flex w-full rounded gap-2' onSubmit={sendMessage}>
          <input
            className='px-4 py-2 focus:outline-none rounded-l flex-grow border'
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)} />
          <button
            className='p-2 px-3 rounded bg-white border text-indigo-600 font-medium'
            type='submit'>
            Send
          </button>
        </form>
        <Switch
          checked={use4}
          onChange={setUse4}
          as='div'
          className='cursor-pointer flex text-xs py-1 items-center gap-2 text-slate-500 justify-end'>
          <div className='flex-shrink-0'>Use GPT-4</div>
          <input readOnly type='checkbox' checked={use4} />
        </Switch>
      </div>
    </div>
  )
}
