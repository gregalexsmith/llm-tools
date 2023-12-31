// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

self.addEventListener("install", () => {
  self.skipWaiting();
  log("[worker] installed");
});

self.addEventListener("activate", async (event) => {
  log("[worker] activated");
  event.waitUntil(self.clients.claim());
  event.waitUntil(await setupPushNotifications());
});

self.addEventListener("push", (event) => {
  log(`[worker] push received`);
  const data = event.data.json();
  log(`[worker] push data: ${JSON.stringify(data)}`);
  const options = {
    body: data.body,
    data: {
      url: data.url,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

const baseUrlsMatch = (url1, url2) => {
  const base1 = url1.split("/")[2];
  const base2 = url2.split("/")[2];
  return base1 === base2;
};

self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  const url = notification.data.url;
  notification.close();

  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (const windowClient of windowClients) {
        if (baseUrlsMatch(windowClient.url, url)) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        matchingClient.focus();
        return matchingClient.navigate(url);
      } else {
        return clients.openWindow(url);
      }
    });

  event.waitUntil(promiseChain);
});

async function setupPushNotifications() {
  const existing = await self.registration.pushManager.getSubscription();
  if (existing) {
    log("[worker] subscription exists");
    return existing;
  }

  const VAPID_PUBLIC_KEY = await getKey();
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const body = {
    subscription: subscription,
    origin: self.location.origin,
  };

  await fetch("/api/notifications/save-subscription", {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  });

  log("[worker] subscription saved");
}

async function getKey() {
  const response = await fetch("/api/notifications/public-key");
  const { key } = await response.json();
  return key;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function log(message) {
  console.log(message);

  // for debugging - send message to all clients
  // self.clients.matchAll().then((clients) => {
  //   clients.forEach((client) => {
  //     client.postMessage(message);
  //   });
  // });
}
