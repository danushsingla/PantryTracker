/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/app', // Adjust as needed
      },
    ];
  },
};

export default nextConfig;