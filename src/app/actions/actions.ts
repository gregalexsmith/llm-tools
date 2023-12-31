"use server";
import { z } from "zod";
import { getUserId } from "~/server/core-actions";
import { db } from "../../server/db";

const createActionSchema = z.object({
  name: z.string(),
  instructions: z.string(),
  cron: z.string(),
  agentId: z.coerce.number(),
  threadId: z.coerce.number(),
});

export const createAction = async (formData: FormData) => {
  const userId = getUserId();
  const validatedFields = createActionSchema.safeParse({
    name: formData.get("name"),
    instructions: formData.get("instructions"),
    cron: formData.get("cron"),
    agentId: formData.get("agentId"),
    threadId: formData.get("threadId"),
  });

  if (!validatedFields.success) {
    console.warn(
      "error creating action",
      validatedFields.error.flatten().fieldErrors,
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, instructions, cron, agentId, threadId } = validatedFields.data;

  const action = await db.action.create({
    data: {
      name: name,
      instructions: instructions,
      cron: cron,
      agent: {
        connect: { id: agentId },
      },
      createdBy: {
        connect: { id: userId },
      },
      thread: {
        connect: { id: threadId },
      },
    },
  });

  return { action };
};

const updateActionSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  cron: z.string(),
  instructions: z.string(),
  agentId: z.coerce.number(),
  threadId: z.coerce.number(),
});

export const updateAction = async (actionId: number, formData: FormData) => {
  const userId = getUserId();
  const validatedFields = updateActionSchema.safeParse({
    id: actionId,
    name: formData.get("name"),
    instructions: formData.get("instructions"),
    cron: formData.get("cron"),
    agentId: formData.get("agentId"),
    threadId: formData.get("threadId"),
  });

  if (!validatedFields.success) {
    console.warn(
      "error updating action",
      validatedFields.error.flatten().fieldErrors,
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, name, instructions, agentId, cron, threadId } =
    validatedFields.data;

  const action = await db.action.update({
    where: { id: id },
    data: {
      name: name,
      instructions: instructions,
      cron: cron,
      agent: {
        connect: { id: agentId },
      },
      createdBy: {
        connect: { id: userId },
      },
      thread: {
        connect: { id: threadId },
      },
    },
  });

  return { action };
};
