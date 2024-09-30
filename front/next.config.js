/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["storage.googleapis.com"],
  },
  // cors
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
