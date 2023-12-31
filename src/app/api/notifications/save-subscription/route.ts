import { type NextRequest } from "next/server";
import { createWebDeviceToken, type WebToken } from "~/modules/notifications";
import { getUserId } from "~/server/core-actions";

type RequestBody = {
  subscription: WebToken;
  origin: string;
};

/**
 * this route is called from the service worker directly
 * when the sw is registered - see /public/sw.js
 */
export async function POST(req: NextRequest) {
  const userId = getUserId();
  const { subscription, origin } = (await req.json()) as RequestBody;
  await createWebDeviceToken(subscription, origin, userId);

  return Response.json({ status: "Success", message: "Subscription saved!" });
}
