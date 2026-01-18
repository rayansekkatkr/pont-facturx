/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Helps OAuth/Stripe popup flows that rely on postMessage.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          // Keep default embedding policy (no cross-origin isolation).
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
        ],
      },
    ];
  },
  async rewrites() {
    // En local: Next (3000) -> FastAPI (8000)
    const backend = process.env.BACKEND_ORIGIN || "http://localhost:8000";
    return [
      {
        source: "/v1/:path*",
        destination: `${backend}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
