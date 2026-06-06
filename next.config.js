/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@mysten/walrus", "@mysten/walrus-wasm"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.experiments = { ...config.experiments, asyncWebAssembly: true };
    }
    return config;
  },
};

module.exports = nextConfig;