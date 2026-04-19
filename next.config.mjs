/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow other devices on your LAN to load dev assets.
  allowedDevOrigins: ["192.168.1.8", "192.168.18.203"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
