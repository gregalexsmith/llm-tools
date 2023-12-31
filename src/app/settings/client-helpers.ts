export const checkSupport = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No support for service worker!");
  }
  if (!("Notification" in window)) {
    throw new Error("No support for notification API");
  }
  if (!("PushManager" in window)) {
    throw new Error("No support for Push API");
  }
};
