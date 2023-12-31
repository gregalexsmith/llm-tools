import { db } from "~/server/db";
import { getUserId } from "~/server/core-actions";
import { PushNotifications } from "./notify";

const DeviceTokens = async () => {
  const deviceTokens = await db.deviceToken.findMany({
    where: { userId: getUserId() },
  });

  if (!deviceTokens.length) {
    return (
      <>
        <h2>Device Tokens</h2>
        <p>No device tokens yet.</p>
      </>
    );
  }

  return (
    <>
      <h3>Device Tokens</h3>
      <table className="w-full table-auto border-collapse text-left">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {deviceTokens.map((deviceToken) => (
            <tr key={deviceToken.id}>
              <td>{deviceToken.id}</td>
              <td>{deviceToken.createdAt.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default function SettingsPage() {
  return (
    <main className="mx-auto my-10 max-w-[700px]">
      <h1>Settings</h1>

      <div className="my-8 grid gap-8">
        <div>
          <PushNotifications />
        </div>
        <div>
          <DeviceTokens />
        </div>
      </div>
    </main>
  );
}
