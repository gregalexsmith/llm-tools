import { type Action } from "@prisma/client";
import { db } from "~/server/db";
import { actionQueue } from "..";

const createActionJob = (action: Action) => {
  return actionQueue.add(
    `Action:${action.id}`,
    { actionId: action.id },
    {
      repeat: {
        pattern: action.cron,
      },
    },
  );
};

const syncRepeatableJobs = async (actions: Action[]) => {
  const jobs = await actionQueue.getRepeatableJobs();

  // Remove and create all repeatable jobs
  // cleaner for now - handles updating cron pattern
  const removers = jobs.map((job) =>
    actionQueue.removeRepeatableByKey(job.key),
  );
  await Promise.all(removers);
  console.log(`Removed ${removers.length} repeatable jobs`);

  // NOTE: this assumes that all actions are repeatable
  const creators = actions.map((action) => createActionJob(action));
  await Promise.all(creators);

  console.log(`Synced ${creators.length} actions to the queue`);
};

/**
 * Sync all actions to the queue
 * Does not sync actions that are already in the queue
 */
export const syncActionsToJobs = async () => {
  const actions = await db.action.findMany();

  await syncRepeatableJobs(actions);
};
