import { useState } from "react";
import { useChat } from "./useChat";
import launchSolid from './assets/logo.png'
import { ChatCompletionRequestMessage } from "openai";

export function Avatar({role}:{role: ChatCompletionRequestMessage['role']}) {
  if (role === 'assistant') {
    return <img src={launchSolid} className='w-12 border' alt={role} />
  } else {
    return <div className='rounded-sm bg-gray-200 w-12 h-12 border-2 border-indigo-400' aria-label={role} />
  }
}

export const Chat = ({className}: {className: string}) => {
  const chat = useChat();
  const [value, setValue] = useState<string>('')

  const { fetchChatCompletions,chatLogRef, isLoading, error, nonSystemMessages }  = chat;

  return (
    <div className={['relative', className].join(' ')}>

      <div className='h-[calc(100%-60px)] overflow-auto divide-y' ref={chatLogRef}>
        {error && error.message}
        {nonSystemMessages.map((m, idx) => (
          <div className='grid grid-cols-[1fr,5fr] p-2' key={`${m.role}-${idx}`}>
            <h4 className='w-16 font-semibold tracking-tight'>
              <Avatar role={m.role} />
            </h4>
            <p className='text-sm pr-4'>{m.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className='grid grid-cols-[1fr,5fr] p-2 animate-pulse'>
            thinking...
          </div>
        )}
      </div>

      <form
        className='p-2 bg-slate-100 flex h-[60px] bottom-0 absolute w-full'
        onSubmit={(e) => {
          e.preventDefault();
          setValue('')
          fetchChatCompletions(value)
        }}
      >
        <input
          className='p-4 rounded border flex-grow'
          type="text"
          value={value}
          defaultValue={''} onChange={(e) => setValue(e.target.value)} />
        <button className='p-2 px-3 font-medium' type='submit'>Send</button>
      </form>
    </div>
  )
}
