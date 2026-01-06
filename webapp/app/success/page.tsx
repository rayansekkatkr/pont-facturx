import SuccessClient from "./success-client";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};
export default function SuccessPage({ searchParams }: PageProps) {
  const raw = searchParams?.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  return <SuccessClient sessionId={sessionId} />;
}
