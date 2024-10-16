/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "res.cloudinary.com", // Allow Cloudinary images
        },
      ],
    },
  };
  
  export default nextConfig;
  