import { useState } from "react";
import { useChat } from "./useChat";
import launchSolid from './assets/logo.png'
import { Switch, Transition } from '@headlessui/react';

import { ChatCompletionRequestMessage } from "openai";

export function Avatar({role}:{role: ChatCompletionRequestMessage['role']}) {
  if (role === 'assistant') {
    return <img src={launchSolid} className='w-12 border' alt={role} />
  } else {
    return <div className='rounded-sm bg-gray-200 w-12 h-12 border-2 border-indigo-400' aria-label={role} />
  }
}

export const Chat = ({className}: {className: string}) => {
  const [use4, setUse4] = useState<boolean>(false)
  const chat = useChat(use4);
  const [value, setValue] = useState<string>('')

  const { fetchChatCompletions,chatLogRef, isLoading, error, nonSystemMessages }  = chat;

  return (
    <div className={['relative', className].join(' ')}>

      <Transition as='div' show className='h-[calc(100%-60px)] bg-slate-50 overflow-auto divide-y' ref={chatLogRef}>

        <>
        {error && error.message}
        {nonSystemMessages.map((m, idx) => (
          <Transition.Child
            enter="transition-all ease-linear duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            key={`${m.role}-${idx}`}
          >
            <div className='grid grid-cols-[1fr,5fr] p-2 self-start' key={`${m.role}-${idx}`}>
              <h4 className='w-16 font-semibold tracking-tight'>
                <Avatar role={m.role} />
              </h4>
              <div className='text-sm pr-4 space-y-3'>
                {m.content.split(/\n/).map((i,idx) => <p key={`para-${idx}`}>{i}</p>)}
              </div>
            </div>
          </Transition.Child>
        ))}
        {isLoading && (
          <div className='self-center bg-slate-300 animate-pulse  text-white m-1 rounded h-auto items-center flex justify-center'>
            <p className='text-sm uppercase p-4 font-light tracking-wide'>thinking...</p>
          </div>
        )}
        {!isLoading && nonSystemMessages.length === 0 && (
          <div className='self-center bg-slate-100 h-full items-center flex justify-center'>
            <p className='text-2xl p-4 tracking-tight animate-pulse'>Hi there.<br />Type a message to get started</p>
          </div>
        )}
        </>
      </Transition>

      <div className='p-2 bg-slate-100 border-t bottom-0 absolute w-full'>
      <form
        className='group flex w-full rounded gap-2'
        onSubmit={(e) => {
          e.preventDefault();
          setValue('')
          fetchChatCompletions(value)
        }}
      >
        <input
          className='px-4 py-2 focus:outline-none rounded-l shadow-inner border flex-grow group-focus-within:ring-2'
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)} />

        <button className='p-2 px-3 rounded bg-white border text-indigo-600 font-medium tracking-tight group-focus-within:ring-2' type='submit'>Send</button>
      </form>
        <Switch checked={use4} onChange={setUse4} as='div' className='cursor-pointer flex flex-shrink-0 items-center gap-2 text-xs pt-2 ml-auto mr-0 text-slate-500 justify-end'>
          <div className='flex-shrink-0'>Use GPT-4</div>
          <input readOnly type='checkbox' checked={use4} />
        </Switch>
      </div>
    </div>
  )
}
