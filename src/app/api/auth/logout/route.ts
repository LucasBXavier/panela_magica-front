import { backendFetch } from "@/lib/server/backend";
import { clearSession, getRefreshToken } from "@/lib/server/session";

export async function POST() {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    // Revoga o refresh token no backend; se falhar, a sessão local é limpa mesmo assim.
    try {
      await backendFetch("/auth/logout", {
        method: "POST",
        auth: false,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {}
  }
  await clearSession();
  return Response.json({ data: null });
}
