"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { runAction } from "~/modules";

export const handleActionRun = async (actionId: number) => {
  await runAction(actionId);

  revalidatePath(`/actions/${actionId}`);
  revalidateTag("get-action");
};
