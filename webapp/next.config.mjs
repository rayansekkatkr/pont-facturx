/** @type {import('next').NextConfig} */
const nextConfig = {
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
