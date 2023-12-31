/**
 * this route is called from the service worker directly
 * when the sw is registered - see /public/sw.js
 */
export function GET() {
  return Response.json({ key: process.env.VAPID_PUBLIC_KEY });
}
