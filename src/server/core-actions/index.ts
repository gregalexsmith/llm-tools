import { auth } from "@clerk/nextjs";

export const getUserId = () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
};
