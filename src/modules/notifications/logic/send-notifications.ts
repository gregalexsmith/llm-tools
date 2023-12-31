import * as webPush from "web-push";
import { db } from "~/server/db";
import { type WebToken } from ".";

const apiKeys = {
  pubKey: process.env.VAPID_PUBLIC_KEY!,
  privKey: process.env.VAPID_PRIVATE_KEY!,
};
const mailTo = `mailto:YOUR_MAILTO_STRING`;

webPush.setVapidDetails(mailTo, apiKeys.pubKey, apiKeys.privKey);

export const sendNotificationToUser = async (
  message: string,
  to: string,
  userId: string,
) => {
  const deviceTokens = await db.deviceToken.findMany({
    where: { userId },
  });

  console.log("Sending notification to", deviceTokens.length, "devices");

  for (const deviceToken of deviceTokens) {
    const subscription = JSON.parse(deviceToken.token) as WebToken;
    try {
      const payload = JSON.stringify({
        title: "Your Notification Title",
        body: message,
        url: `${deviceToken.origin}/${to}`,
      });
      await webPush.sendNotification(subscription, payload);
    } catch (err) {
      const error = err as webPush.WebPushError;
      const { statusCode, body } = error;
      if (statusCode === 410) {
        console.log("subscription expired or revoked", statusCode, body);
        await db.deviceToken.delete({ where: { id: deviceToken.id } });
      }
    }
  }

  return { status: "Success", message: "Message sent to push service" };
};
