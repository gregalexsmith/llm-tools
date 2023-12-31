import { type Message } from "@prisma/client";

const isFromUser = (message: Message) => message.senderType === "human";

export const MessageHistory = ({ messages }: { messages: Message[] }) => {
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className="border-b border-gray-700 px-2 pb-4 pt-3"
        >
          <div className="">
            <span className="font-extrabold dark:text-white">
              {isFromUser(message) ? "You" : "Agent"}
            </span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {message.createdAt.toLocaleTimeString()}
            </span>
          </div>
          <div
            className={`whitespace-pre-wrap`}
            dangerouslySetInnerHTML={{ __html: message.text }}
          ></div>
        </div>
      ))}
    </>
  );
};
