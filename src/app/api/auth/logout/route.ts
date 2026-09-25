import { clearSession } from "@/lib/server/session";

export async function POST() {
  await clearSession();
  return Response.json({ data: null });
}
