"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "~/server/db";
import { getUserId } from "~/server/core-actions";
import { modelTypes } from "../../modules/llm";

const agentSchema = z.object({
  name: z.string(),
  systemPrompt: z.string(),
  modelType: z.enum(modelTypes),
  createdById: z.string(),
});

export const createAgent = async (formData: FormData) => {
  const userId = getUserId();

  // typically the first action a user takes
  // so ensure they have a user record
  await db.user.upsert({
    where: {
      id: userId,
    },
    update: {},
    create: {
      id: userId,
    },
  });

  const validatedFields = agentSchema.safeParse({
    name: formData.get("name"),
    modelType: formData.get("modelType"),
    systemPrompt: formData.get("systemPrompt"),
    createdById: userId,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await db.agent.create({
    data: validatedFields.data,
  });

  revalidatePath("/agents");
};

export const updateAgent = async (agentId: number, formData: FormData) => {
  const userId = getUserId();
  const validatedFields = agentSchema.safeParse({
    name: formData.get("name"),
    modelType: formData.get("modelType"),
    systemPrompt: formData.get("systemPrompt"),
    createdById: userId,
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await db.agent.update({
    where: {
      id: agentId,
    },
    data: validatedFields.data,
  });

  revalidatePath("/agents");
};
