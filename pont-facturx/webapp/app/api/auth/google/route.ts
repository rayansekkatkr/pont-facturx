import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json(); // { id_token }
  const r = await fetch(`${process.env.BACKEND_URL}/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await r.json();
  if (!r.ok) return NextResponse.json(data, { status: r.status });

  const res = NextResponse.json(data);
  res.cookies.set("pfxt_token", data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  return res;
}
