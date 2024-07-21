/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com'],
    },
    server: {
        port: process.env.CLIENT_PORT || 3000,
    },
};

export default nextConfig;
