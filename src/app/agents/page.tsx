import { db } from "~/server/db";
import { createAgent } from "./actions";
import Link from "next/link";
import { AgentFormFields } from "./form";
import { getUserId } from "../../server/core-actions";
import classNames from "classnames";

export default async function Agents() {
  const agents = await db.agent.findMany({
    where: { createdById: getUserId() },
  });

  return (
    <main className="mx-auto my-10 w-full max-w-[900px]">
      <h1 className="mb-4">Agents</h1>

      <form action={createAgent}>
        <AgentFormFields />
        <button type="submit">Create Agent</button>
      </form>

      <ul>
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="hover:no-underline"
          >
            <li
              className={classNames(
                "w-full p-4",
                "bg-white hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800",
                "border-b border-gray-400 dark:border-gray-600",
                "cursor-pointer",
              )}
            >
              <div className="flex gap-8">
                <div>{agent.name}</div>
                <div className="text-gray-600 dark:text-gray-400 ">
                  {agent.modelType}
                </div>
              </div>
              <div className="text-gray-800 dark:text-gray-200">
                {agent.systemPrompt}
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </main>
  );
}
