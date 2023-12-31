import { db } from "~/server/db";
import { parseId } from "~/helpers";
import { getUserId } from "~/server/core-actions";
import { AgentFormFields } from "../form";
import { updateAgent } from "../actions";

export default async function Agent({ params }: { params: { id: number } }) {
  const intId = parseId(params.id);
  const agent = await db.agent.findFirstOrThrow({
    where: { id: intId, createdById: getUserId() },
  });
  const updateAgentWithId = updateAgent.bind(null, intId);

  return (
    <main className="mx-auto my-10 w-full max-w-[700px]">
      <h1>{agent.name}</h1>

      <form action={updateAgentWithId}>
        <AgentFormFields defaultValues={{ ...agent }} />
        <button type="submit" value="Update Agent">
          Update Agent
        </button>
      </form>
    </main>
  );
}
