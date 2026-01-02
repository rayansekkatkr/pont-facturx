export type StoredConversionStatus = "success" | "error" | "processing";

export type StoredConversion = {
  id: string;
  fileName: string;
  profile: string;
  status: StoredConversionStatus;
  createdAt: string; // ISO
};

const KEY = "pfxt_conversions_v1";

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadConversions(): StoredConversion[] {
  if (typeof window === "undefined") return [];

  const parsed = safeParseJson<unknown>(window.localStorage.getItem(KEY));
  if (!Array.isArray(parsed)) return [];

  const normalized: StoredConversion[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const it = item as Record<string, unknown>;

    const id = typeof it.id === "string" ? it.id : "";
    const fileName = typeof it.fileName === "string" ? it.fileName : "";
    if (!id || !fileName) continue;

    const statusRaw = it.status;
    const status: StoredConversionStatus =
      statusRaw === "success" || statusRaw === "error" || statusRaw === "processing"
        ? statusRaw
        : "success";

    normalized.push({
      id,
      fileName,
      profile:
        typeof it.profile === "string" && it.profile ? it.profile : "BASIC WL",
      status,
      createdAt:
        typeof it.createdAt === "string" && it.createdAt
          ? it.createdAt
          : new Date().toISOString(),
    });
  }

  normalized.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return normalized;
}

export function upsertConversions(incoming: StoredConversion[]): StoredConversion[] {
  if (typeof window === "undefined") return [];

  const existing = loadConversions();
  const byId = new Map<string, StoredConversion>();

  for (const c of existing) byId.set(c.id, c);

  for (const c of incoming) {
    if (!c?.id) continue;
    const prev = byId.get(c.id);

    byId.set(c.id, {
      id: c.id,
      fileName: c.fileName || prev?.fileName || `File-${c.id}`,
      profile: c.profile || prev?.profile || "BASIC WL",
      status: c.status || prev?.status || "success",
      createdAt: c.createdAt || prev?.createdAt || new Date().toISOString(),
    });
  }

  const merged = Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  window.localStorage.setItem(KEY, JSON.stringify(merged));
  return merged;
}

export function clearConversions(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function countSuccessfulConversionsThisMonth(): number {
  if (typeof window === "undefined") return 0;

  const all = loadConversions();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return all.filter((c) => {
    if (c.status !== "success") return false;
    const d = new Date(c.createdAt);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;
}
