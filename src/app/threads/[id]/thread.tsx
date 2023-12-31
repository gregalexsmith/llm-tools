"use client";
import { type Message } from "@prisma/client";
import { sendMessage } from "./actions";
import { MessageHistory } from "./message-history";
import { startTransition, useEffect, useOptimistic, useRef } from "react";
import { onMetaEnter } from "../../../helpers/keyboard-utils";

const optimisticMessage = (
  text: string,
  senderType: string,
  threadId: number,
) => ({
  id: Math.random(),
  text,
  threadId,
  senderType,
  read: false,
  updatedAt: new Date(),
  createdAt: new Date(),
});

type ThreadProps = {
  id: number;
  messages: Message[];
};

type Action =
  | { type: "add"; payload: Message }
  | { type: "replace"; payload: Message[] };

export const Thread = ({ id, messages }: ThreadProps) => {
  const [optimisticMessages, dispatchOptimistic] = useOptimistic(
    messages,
    (state: Message[], action: Action) => {
      if (action.type === "add") {
        return [...state, action.payload];
      }
      if (action.type === "replace") {
        return action.payload;
      }
      return state;
    },
  );

  useEffect(() => {
    startTransition(() => {
      dispatchOptimistic({ type: "replace", payload: messages });
    });
  }, [messages, dispatchOptimistic]);

  const formRef = useRef<HTMLFormElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const onFormAction = async (formData: FormData) => {
    const text = formData.get("text") as string;
    startTransition(() => {
      dispatchOptimistic({
        type: "add",
        payload: optimisticMessage(text, "human", id),
      });
      dispatchOptimistic({
        type: "add",
        payload: optimisticMessage("...", "ai", id),
      });
    });
    formRef.current?.reset();
    await sendMessage(id, formData);
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [optimisticMessages]);

  return (
    <>
      <div className="h-full overflow-scroll">
        <MessageHistory messages={optimisticMessages} />
        <div ref={messageEndRef} />
      </div>
      <form
        action={onFormAction}
        onKeyDown={onMetaEnter(onFormAction)}
        ref={formRef}
      >
        <div className="flex">
          <textarea name="text" />
          <button type="submit">Send</button>
        </div>
      </form>
    </>
  );
};
