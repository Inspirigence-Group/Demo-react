/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'RealtyMatch CRM',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Real Estate Management Platform'
  }
}

module.exports = nextConfig
