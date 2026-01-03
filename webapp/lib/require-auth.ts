import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const token = (await cookies()).get("pfxt_token")?.value;
  if (!token) redirect("/");
}
