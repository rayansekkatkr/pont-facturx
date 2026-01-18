import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { detail: "Code manquant" },
      { status: 400 },
    );
  }

  const backend = process.env.BACKEND_URL;
  if (!backend) {
    return NextResponse.json(
      { detail: "BACKEND_URL manquant" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("pfxt_token")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "Non authentifié" },
      { status: 401 },
    );
  }

  const r = await fetch(`${backend}/v1/auth/verify-code?code=${code}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await r.json();

  return NextResponse.json(data, { status: r.status });
}
