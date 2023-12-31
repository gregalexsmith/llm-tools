import { db } from "~/server/db";
import { parseId } from "~/helpers";
import { getUserId } from "~/server/core-actions";
import { ActionFields } from "../form";
import { updateAction } from "../actions";
import { Thread } from "../../threads/[id]/thread";
import { handleActionRun } from "./actions";
import Link from "next/link";
import { clearAllJobs, getJobs, syncActionsToJobs } from "~/modules";
import classNames from "classnames";

type ActionPageProps = {
  params: { id: number | string };
};

const testWorker = async () => {
  "use server";
  await syncActionsToJobs();
};

const clearJobs = async () => {
  "use server";
  await clearAllJobs();
};

const Jobs = async () => {
  const { jobs, repeatableJobs } = await getJobs();
  const jobsData = await Promise.all(
    jobs.map(async (job) => ({
      ...job,
      state: await job.getState?.(),
    })),
  );
  return (
    <div className="grid gap-2">
      <h2>Jobs</h2>
      <ul>
        {jobs.length === 0 && <li>No jobs</li>}
        {jobsData.map((job) => (
          <li key={job.id}>
            <pre>{`${job.name} - ${job.state}`}</pre>
          </li>
        ))}
      </ul>
      <h2 className="mt-2">Repeatable Jobs</h2>
      <ul>
        {repeatableJobs.length === 0 && <li>No repeatable jobs</li>}
        {repeatableJobs.map((job) => (
          <li key={job.id}>
            <pre>{JSON.stringify(job, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default async function ActionPage({ params }: ActionPageProps) {
  const intId = parseId(params.id);
  const action = await db.action.findFirstOrThrow({
    where: { id: intId, createdById: getUserId() },
    include: { thread: { include: { messages: true } } },
  });
  const updateActionWithId = updateAction.bind(null, intId);
  const runAction = handleActionRun.bind(null, intId);

  return (
    <main className="mx-auto my-10 grid h-full w-full max-w-[1000px] grid-cols-2 gap-8 overflow-hidden">
      <section>
        <h1>{action.name}</h1>

        <form action={updateActionWithId}>
          <ActionFields defaultValues={{ ...action }} />
          <button type="submit" value="Update action">
            Update Action
          </button>
        </form>

        <form action={runAction} className="mt-4">
          <button type="submit" value="Run action">
            Run Action
          </button>
        </form>

        <form action={clearJobs} className="mt-4">
          <button type="submit" value="Run action">
            Clear Completed Jobs
          </button>
        </form>

        <form action={testWorker} className="mt-4">
          <button type="submit" value="Test worker">
            Sync Worker
          </button>
        </form>

        <section className="mt-4">
          <Jobs />
        </section>
      </section>

      <section
        className={classNames(
          "mx-auto w-full max-w-[700px]",
          "h-full max-h-[700px] overflow-hidden",
          "flex flex-col",
        )}
      >
        <h2 className="">
          <Link href={`/threads/${action.thread.id}`}>Thread</Link>
        </h2>

        <div className="h-full overflow-hidden">
          <Thread id={action.thread.id} messages={action.thread.messages} />
        </div>
      </section>
    </main>
  );
}
