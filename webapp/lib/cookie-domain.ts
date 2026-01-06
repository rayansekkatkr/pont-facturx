export function cookieDomainForHost(hostname: string | null | undefined): string | undefined {
  const host = (hostname || "").split(":")[0].toLowerCase();
  if (!host) return undefined;

  // Only set an explicit domain for the real production domain so that
  // cookies are shared between apex + www.
  if (host === "pont-facturx.com" || host.endsWith(".pont-facturx.com")) {
    return ".pont-facturx.com";
  }

  return undefined;
}
