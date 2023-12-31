"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "~/server/db";
import { getUserId } from "~/server/core-actions";
import { redirect } from "next/navigation";

const threadSchema = z.object({
  name: z.string(),
  agentId: z.coerce.number(),
});

export const createThread = async (formData: FormData) => {
  const userId = getUserId();
  const validatedFields = threadSchema.safeParse({
    name: formData.get("name"),
    agentId: formData.get("agentId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let threadId;
  try {
    const thread = await db.thread.create({
      data: {
        name: validatedFields.data.name,
        agent: {
          connect: { id: validatedFields.data.agentId },
        },
        createdBy: {
          connect: { id: userId },
        },
      },
    });
    threadId = thread.id;
    revalidatePath(`/threads`);
  } catch (error) {
    console.error(error);
    return {
      errors: {
        name: "Something went wrong",
      },
    };
  }

  // redirect throws an error for next, so need it outside of try/catch
  // https://github.com/vercel/next.js/issues/49298#issuecomment-1542055642
  redirect(`/threads/${threadId}`);
};
