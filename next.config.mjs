import { withPayload } from '@payloadcms/next/withPayload'

// Specify the domains for image optimization
const domains = [

];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains,
    unoptimized: true,
  },
  experimental: {
    serverSourceMaps: true,
  },
  productionBrowserSourceMaps: true,
  output: 'standalone',
  serverExternalPackages: ["@logtail/pino","ffmpeg-static"],
}

export default withPayload(nextConfig)
