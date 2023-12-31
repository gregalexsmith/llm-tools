import { Worker } from "bullmq";
import { type ActionJob, ActionQueueName } from "../constants";
import { runAction } from "../logic/run-action";

const connection = {
  host: process.env.REDIS_HOST,
  port: 6379,
};

export const setupActionWorker = () => {
  new Worker<ActionJob>(
    ActionQueueName,
    async (job) => {
      await job.log(`Started processing job with id ${job.id}`);
      const { actionId } = job.data;
      await runAction(actionId);
      await job.updateProgress(100);
      console.log(`Completed job with id ${job.id}`, job.data);
      return "DONE";
    },
    { connection: connection },
  );
};
