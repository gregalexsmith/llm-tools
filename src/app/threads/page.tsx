import classNames from "classnames";
import Link from "next/link";
import { getUserId } from "~/server/core-actions";
import { db } from "~/server/db";

export default async function Threads() {
  const userId = getUserId();
  const threads = await db.thread.findMany({
    where: { createdById: userId },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
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
    <main className="mx-auto w-full max-w-[900px] py-2">
      <div className="mb-2 flex items-center justify-between gap-2 px-4">
        <h1>Threads</h1>
        <Link href="/threads/new" className="btn">
          Create Thread
        </Link>
      </div>

      <ul className="flex w-full flex-col">
        {threads.map((thread) => {
          const unread = thread.messages.some((message) => !message.read);
          const preview = thread.messages[0]?.text;
          const time = thread.messages[0]?.createdAt.toLocaleTimeString();

          return (
            <Link key={thread.id} href={`/threads/${thread.id}`}>
              <div
                key={thread.id}
                className={classNames(
                  "p-4",
                  "grid w-full grid-cols-[auto,1fr,auto] items-center justify-between",
                  "bg-white hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800",
                  "border-b border-gray-400 dark:border-gray-600",
                  "cursor-pointer",
                  {
                    "bg-gray-100 dark:bg-gray-800": unread,
                  },
                )}
              >
                {unread && (
                  <span className="mr-4 h-2 w-2 rounded-full bg-blue-500"></span>
                )}

                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold">{thread.name}</span>
                  <span className="text-gray-600dark:text-gray-400 truncate text-sm">
                    {preview}
                  </span>
                </div>

                <div className="text-right text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {time}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </ul>
    </main>
  );
}
