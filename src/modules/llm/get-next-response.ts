import { type Message } from "@prisma/client";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { AIMessage, HumanMessage } from "langchain/schema";
import { type ModelType } from ".";

type Args = {
  input: string;
  systemPromptTemplate: string;
  modelType: ModelType;
  messageHistory: Message[];
};

export const getNextChatResponse = async ({
  input,
  messageHistory,
  modelType,
  systemPromptTemplate,
}: Args) => {
  const chatPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPromptTemplate),
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);

  const formattedHistory = messageHistory.map((message) => {
    if (message.senderType === "human") {
      return new HumanMessage(message.text);
    }
    return new AIMessage(message.text);
  });

  const chatMemory = new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
    inputKey: "input",
    chatHistory:
      formattedHistory.length > 0
        ? new ChatMessageHistory(formattedHistory)
        : undefined,
  });

  const chat = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: modelType,
  });
  const chain = new LLMChain({
    memory: chatMemory,
    prompt: chatPrompt,
    llm: chat,
  });

  const result = await chain.call({
    input,
  });

  const responseText = result.text as string | undefined;
  if (!responseText) {
    throw new Error("No response text from AI.");
  }

  return responseText;
};
