import { db } from "~/server/db";
import { type ModelType, getNextChatResponse } from "~/modules/llm";
import { sendNotificationToUser } from "../../notifications";

export const runAction = async (actionId: number) => {
  const action = await db.action.findFirstOrThrow({
    where: {
      id: actionId,
    },
    include: {
      agent: true,
      thread: {
        include: {
          messages: true,
        },
      },
    },
  });

  const response = await getNextChatResponse({
    input: action.instructions,
    modelType: action.agent.modelType as ModelType,
    messageHistory: action.thread.messages,
    systemPromptTemplate: action.agent.systemPrompt,
  });

  await db.message.create({
    data: {
      text: response,
      senderType: "ai",
      thread: {
        connect: {
          id: action.thread.id,
        },
      },
    },
  });

  const to = `actions/${action.id}`;
  await sendNotificationToUser(response, to, action.createdById);
};
