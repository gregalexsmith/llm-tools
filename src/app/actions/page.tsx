import { createAction } from "./actions";
import Link from "next/link";
import { getUserId } from "~/server/core-actions";
import { db } from "~/server/db";
import { ActionFields } from "./form";
import classNames from "classnames";

export default async function ActionsPage() {
  const userId = getUserId();
  const actions = await db.action.findMany({
    where: { createdById: userId },
  });

  return (
    <main className="mx-auto my-10 w-full max-w-[700px]">
      <h1>Actions</h1>

      <form action={createAction}>
        <ActionFields />

        <button type="submit">Create</button>
      </form>

      <ul>
        {actions.map((action) => (
          <Link key={action.id} href={`/actions/${action.id}`}>
            <li
              className={classNames(
                "w-full p-4",
                "bg-white hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800",
                "border-b border-gray-400 dark:border-gray-600",
                "cursor-pointer",
              )}
            >
              {action.name}
            </li>
          </Link>
        ))}
      </ul>
    </main>
  );
}
