import { getSession } from "@/lib/server/session";

export async function GET() {
  const usuario = await getSession();
  if (!usuario) {
    return Response.json({ message: "Não autenticado", status: 401 }, { status: 401 });
  }
  return Response.json({ data: usuario });
}
