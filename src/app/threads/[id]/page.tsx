import { db } from "~/server/db";
import Link from "next/link";
import { getUserId } from "~/server/core-actions";
import { Thread } from "./thread";
import { clearThreadMessages } from "./actions";
import classNames from "classnames";

type ThreadPageProps = {
  params: { id: number };
};

const ClearThreadMessages = ({ threadId }: { threadId: number }) => {
  return (
    <form action={clearThreadMessages.bind(null, threadId)}>
      <button className="border-transparent bg-transparent text-red-600">
        Clear Messages
      </button>
    </form>
  );
};

export default async function ThreadPage({ params }: ThreadPageProps) {
  const threadId = Number(params.id);
  const thread = await db.thread.findFirstOrThrow({
    where: { id: threadId, createdById: getUserId() },
    include: { agent: true, messages: true },
  });

  return (
    <main
      className={classNames(
        "mx-auto max-w-[700px]",
        "h-full flex-1",
        "flex flex-col overflow-hidden",
        "absolute bottom-0 left-0 right-0 top-0",
        "surface",
      )}
    >
      <header className="p-2">
        <div className="flex items-center justify-between">
          <span>{thread.name}</span>
          <div>
            Agent:{" "}
            <Link href={`/agents/${thread.agent.id}`}>{thread.agent.name}</Link>
          </div>
          <ClearThreadMessages threadId={threadId} />

          <Link href={`/threads`} className="text-sm">
            Close
          </Link>
        </div>
      </header>

      <Thread id={threadId} messages={thread.messages} />
    </main>
  );
}
