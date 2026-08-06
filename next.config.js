/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Fotos propias subidas al panel admin (MediaAsset → pickBlogFoto).
      // Sin esta entrada next/image devuelve 400 y el hero del blog sale roto.
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      // Fotos de las habitaciones de Quado (Squarespace)
      { protocol: 'https', hostname: 'images.squarespace-cdn.com' },
    ],
    // El S22 Ultra pide 412px @ DPR 3.5 → sin 1440 salta directo a 1920
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://assets.calendly.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Ojo: `blob:` es el esquema de URI, NO el dominio de Vercel Blob.
      // Las fotos propias viven en *.public.blob.vercel-storage.com y necesitan su propia entrada.
      "img-src 'self' data: blob: https://images.unsplash.com https://images.squarespace-cdn.com https://*.public.blob.vercel-storage.com https://img.youtube.com https://i.ytimg.com https://www.google-analytics.com https://www.googletagmanager.com https://*.calendly.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://calendly.com https://*.calendly.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://js.stripe.com https://hooks.stripe.com https://calendly.com https://*.calendly.com",
      "media-src 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
