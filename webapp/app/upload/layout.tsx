import type React from "react";
import { requireAuth } from "@/lib/require-auth";

export default async function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <>{children}</>;
}
