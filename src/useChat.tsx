import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import { useEffect, useRef, useState } from "react";
import { createSystemPrompt } from "./createSystemPrompt";

const configuration = new Configuration({
    organization: import.meta.env.VITE_OPENAI_ORG,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const useChat = (useGpt4: boolean = false) => {
  const [chatCompletions, setChatCompletions] = useState<unknown>([])
  const [messages, setMessages] = useState(() => createSystemPrompt())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)


  const fetchChatCompletions = async (message: string) => {
    let thisMessage:ChatCompletionRequestMessage = { "role": "user", "content": message }
    setIsLoading(true)
    setMessages([...messages, thisMessage])
    try {
      const { data } = await openai.createChatCompletion({
        model: useGpt4 ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [...messages, thisMessage]
      })
      setChatCompletions(data)
      if (data.choices[0].message) {
        setMessages([...messages, thisMessage, data.choices[0].message])
      }
    }
    catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Workaround: Scroll to bottom of chat log whenever a message is added
   */
  const chatLogRef = useRef(null);
  useEffect(() => {
    if (chatLogRef.current) {
      // @ts-ignore
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [chatLogRef, messages])


  const nonSystemMessages = messages.filter(i => i.role !== 'system')

  return {
    chatCompletions,
    isLoading,
    error,
    fetchChatCompletions,
    messages,
    nonSystemMessages,
    chatLogRef
  }
}
