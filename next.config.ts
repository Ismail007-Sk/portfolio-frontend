import type { NextConfig } from "next";

function getApiRemotePattern() {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  try {
    const url = new URL(raw);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/**" as const,
    };
  } catch {
    return {
      protocol: "http" as const,
      hostname: "localhost",
      port: "3001",
      pathname: "/**" as const,
    };
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      getApiRemotePattern(),
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
