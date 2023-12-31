"use client";
import { useEffect, useState } from "react";
import { checkSupport } from "./client-helpers";

const registerSW = async () => {
  const existingRegistration = await navigator.serviceWorker.getRegistration();
  if (existingRegistration) {
    return existingRegistration;
  }

  const registration = await navigator.serviceWorker.register("sw.js");
  return registration;
};

const unregisterSW = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    await registration.unregister();
  }
};

const sendNotification = async () => {
  await fetch("/api/notifications/send-notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
};

export const PushNotifications = () => {
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | undefined
  >();

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
  };

  useEffect(() => {
    const main = async () => {
      checkSupport();
      await registerSW();
    };
    main().catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <>
      <h2>Push Notifications</h2>
      <p>
        Allow the browser to send you push notifications. You can send a test
        notification below once you have granted permission.
      </p>
      <div className="py-2">
        <span className="font-bold">Browser permission:</span>{" "}
        {permissionStatus}
      </div>
      <section className="flex gap-2 py-2">
        {permissionStatus !== "granted" && (
          <button onClick={requestPermission}>Request permission</button>
        )}
        <button onClick={() => sendNotification()}>Send Notification</button>
        <button onClick={() => unregisterSW()}>Unregister SW</button>
      </section>
    </>
  );
};
