import { createThread } from "../actions";
import { getUserId } from "~/server/core-actions";
import { db } from "~/server/db";

export default async function Threads() {
  const userId = getUserId();
  const agents = await db.agent.findMany({
    where: { createdById: userId },
  });

  if (!agents.length) {
    return (
      <main className="mx-auto my-10 max-w-[700px]">
        <h1>Threads</h1>
        <p>
          No agents <a href="/agents">go here</a> to create one
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto my-10 max-w-[700px]">
      <h1>New Thread</h1>

      <form action={createThread}>
        <label htmlFor="name">
          Name
          <input name="name" type="text" id="name" />
        </label>

        <label htmlFor="agentId">
          Agent ID
          <select name="agentId" id="agentId">
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Create Thread</button>
      </form>
    </main>
  );
}
