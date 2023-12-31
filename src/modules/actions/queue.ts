import { Queue } from "bullmq";
import { connection } from "~/workers";
import { ActionQueueName, type ActionJob } from "./constants";

export const actionQueue = new Queue<ActionJob>(ActionQueueName, {
  connection: connection,
});

export const clearCompletedJobs = async () => {
  const jobs = await actionQueue.getJobs(["completed"]);
  const promises = jobs.map((job) => job.remove());
  await Promise.all(promises);
  console.log(`Cleared ${promises.length} completed jobs`);
  console.log(
    `jobs`,
    (await getJobs()).jobs.map((job) => `${job.name}`),
  );
};

export const clearAllJobs = async () => {
  const jobs = await actionQueue.getJobs();
  const promises = jobs.map((job) => job.remove());
  await Promise.all(promises);
  console.log(`Cleared ${promises.length} jobs`);
  console.log(
    `jobs`,
    (await getJobs()).jobs.map((job) => `${job.name}`),
  );

  // Clear repeatable jobs
  const repeatableJobs = await actionQueue.getRepeatableJobs();
  if (repeatableJobs.length > 0) {
    for (const repeatableJob of repeatableJobs) {
      await actionQueue.removeRepeatableByKey(repeatableJob.key);
    }
    console.log(`Cleared ${repeatableJobs.length} repeatable jobs`);
  }
};

export const getJobs = async () => {
  const jobs = await actionQueue.getJobs([
    "waiting",
    "active",
    "completed",
    "failed",
    "wait",
    "waiting",
  ]);
  const repeatableJobs = await actionQueue.getRepeatableJobs();
  return { jobs, repeatableJobs };
};
