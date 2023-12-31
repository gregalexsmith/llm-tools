import { getUserId } from "~/server/core-actions";
import { db } from "~/server/db";

type ActionFieldsProps = {
  defaultValues?: {
    name?: string;
    instructions?: string;
    cron?: string;
    agentId?: number;
    threadId?: number;
  };
};

export const ActionFields = async ({ defaultValues }: ActionFieldsProps) => {
  const userId = getUserId();
  const threads = await db.thread.findMany({
    where: { createdById: userId },
  });
  const agents = await db.agent.findMany({
    where: { createdById: userId },
  });

  if (!agents.length) {
    return (
      <p>
        No agents <a href="/agents">go here</a> to create one
      </p>
    );
  }

  if (!threads.length) {
    return (
      <p>
        No threads <a href="/threads">go here</a> to create one
      </p>
    );
  }

  return (
    <>
      <label htmlFor="name">
        Name
        <input
          name="name"
          type="text"
          id="name"
          defaultValue={defaultValues?.name}
        />
      </label>

      <label htmlFor="instructions">
        Instructions
        <textarea
          name="instructions"
          id="instructions"
          defaultValue={defaultValues?.instructions}
        />
      </label>

      <label htmlFor="cron">
        Cron
        <input
          name="cron"
          type="text"
          id="cron"
          defaultValue={defaultValues?.cron ?? "30 18 * * *"}
        />
      </label>

      <label htmlFor="agentId">
        Agent ID
        <select
          name="agentId"
          id="agentId"
          defaultValue={defaultValues?.agentId}
        >
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="threadId">
        Thread ID
        <select
          name="threadId"
          id="threadId"
          defaultValue={defaultValues?.threadId}
        >
          {threads.map((thread) => (
            <option key={thread.id} value={thread.id}>
              {thread.name}
            </option>
          ))}
        </select>
      </label>
    </>
  );
};
