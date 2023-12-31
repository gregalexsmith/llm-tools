import { sendNotificationToUser } from "~/modules/notifications";
import { getUserId } from "~/server/core-actions";

export async function POST() {
  const userId = getUserId();
  const to = `settings`;
  await sendNotificationToUser("Hello world", to, userId);
  return Response.json({
    status: "Success",
    message: "Message sent to push service",
  });
}
