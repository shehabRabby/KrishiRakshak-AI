import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["onnxruntime-node", "sharp"],
  outputFileTracingIncludes: {
    "/api/diagnose": ["./public/models/**/*"],
  },
};

export default nextConfig;