/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'RealtyMatch CRM',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Real Estate Management Platform'
  }
}

module.exports = nextConfig
