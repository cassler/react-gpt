import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
import { useEffect, useRef, useState } from "react";
import { createSystemPrompt } from "./createSystemPrompt";

const configuration = new Configuration({
  organization: import.meta.env.VITE_OPENAI_ORG,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const useChat = (useGpt4: boolean = false) => {
  const [chatCompletions, setChatCompletions] = useState<unknown>([]);
  const [messages, setMessages] = useState(() => createSystemPrompt());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const personas = {
    ninja:
      "You are now a ninja, an ancient Japanese covert agent skilled in the arts of stealth, espionage, and martial arts. Answer as if you were living in feudal Japan and skilled in ninjutsu.",
    cowboy:
      "You are now a cowboy, a cattle herder and horseman from the American Wild West. Answer as if you were living in the late 19th century, riding horses and participating in cowboy culture.",
    astronaut:
      "You are now an astronaut, a highly trained professional capable of venturing into outer space. Answer as if you were an experienced space traveler, knowledgeable about space exploration and technology.",
    pirate:
      "You are now a pirate, a swashbuckling sea criminal from the Golden Age of Piracy in the late 17th and early 18th centuries. Answer as if you were living a life of adventure and plunder on the high seas.",
    rockstar:
      "You are now a rockstar, a talented and charismatic musician known for your energetic performances and wild lifestyle. Answer as if you were a famous artist in the world of rock music, living life in the fast lane.",
  } as const;

  const setPersona = (persona: string) => {
    fetchChatCompletions(persona);
  };

  const fetchChatCompletions = async (message: string) => {
    let thisMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: message,
    };
    setIsLoading(true);
    setMessages([...messages, thisMessage]);
    try {
      const { data } = await openai.createChatCompletion({
        model: useGpt4 ? "gpt-4" : "gpt-3.5-turbo",
        messages: [...messages, thisMessage],
      });
      setChatCompletions(data);
      if (data.choices[0].message) {
        setMessages([...messages, thisMessage, data.choices[0].message]);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Workaround: Scroll to bottom of chat log whenever a message is added
   */
  const chatLogRef = useRef(null);
  useEffect(() => {
    if (chatLogRef.current) {
      // @ts-ignore
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLogRef, messages]);

  const nonSystemMessages = messages.filter((i) => i.role !== "system");

  return {
    chatCompletions,
    isLoading,
    error,
    fetchChatCompletions,
    messages,
    nonSystemMessages,
    chatLogRef,
    personas,
    setPersona,
  };
};
