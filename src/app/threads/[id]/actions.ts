"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "~/server/db";
import { type ModelType, getNextChatResponse } from "~/modules/llm";
import { getUserId } from "~/server/core-actions";

const messageSchema = z.object({
  text: z.string().min(1),
});

export const sendMessage = async (threadId: number, formData: FormData) => {
  const validatedFields = messageSchema.safeParse({
    text: formData.get("text"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const message = await db.message.create({
    data: {
      text: validatedFields.data.text,
      senderType: "human",
      thread: {
        connect: {
          id: threadId,
        },
      },
    },
  });

  const thread = await db.thread.findFirstOrThrow({
    where: {
      id: threadId,
    },
    include: {
      agent: true,
      messages: true,
    },
  });

  const response = await getNextChatResponse({
    input: message.text,
    modelType: thread.agent.modelType as ModelType,
    messageHistory: thread.messages,
    systemPromptTemplate: thread.agent.systemPrompt,
  });

  await db.message.create({
    data: {
      text: response,
      senderType: "ai",
      thread: {
        connect: {
          id: threadId,
        },
      },
    },
  });

  revalidatePath("/threads");
};

export const clearThreadMessages = async (threadId: number) => {
  const userId = getUserId();
  const thread = await db.thread.findFirst({
    where: { id: threadId, createdById: userId },
  });
  if (!thread) {
    throw new Error("Thread not found");
  }
  await db.message.deleteMany({
    where: {
      threadId,
    },
  });

  revalidatePath("/threads");
  revalidatePath(`/threads/${threadId}`);
};
