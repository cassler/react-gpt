import { SyntheticEvent, useState } from "react";

export const ChatInput = ({
  sendMessage,
}: {
  sendMessage: (arg0: string) => void;
}) => {
  const [value, setValue] = useState<string>("");
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    sendMessage(value);
    setValue("");
  };

  return (
    <form className="group flex w-full rounded gap-2" onSubmit={handleSubmit}>
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
  );
};
