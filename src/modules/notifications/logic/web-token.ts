import { z } from "zod";
import { DeviceType } from "..";
import { db } from "~/server/db";

const webTokenSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

export type WebToken = z.infer<typeof webTokenSchema>;

export const createWebDeviceToken = async (
  webToken: WebToken,
  origin: string,
  userId: string,
) => {
  const type = DeviceType.WEB;
  const tokenObject = webTokenSchema.parse(webToken);

  const token = await db.deviceToken.create({
    data: {
      type,
      token: JSON.stringify(tokenObject),
      origin,
      user: {
        connect: { id: userId },
      },
    },
  });
  return token;
};
