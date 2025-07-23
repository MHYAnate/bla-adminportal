// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         hostname: "res.cloudinary.com",
//       },
//       {
//         hostname: "example.com",
//       },
//     ],
//   },
//   experimental: {
//     missingSuspenseWithCSRBailout: false,
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // List Cloudinary domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // The pathname for Cloudinary images usually starts with '/<cloud_name>/image/upload/'
        // For the example URL provided: "https://res.cloudinary.com/dersoiltc/image/upload/v1744729986/WhatsApp_Image_2025-04-15_at_11.49.37_1_ucnbny.jpg"
        // the pathname would be '/dersoiltc/image/upload/**'
        pathname: '/dersoiltc/image/upload/**', 
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;