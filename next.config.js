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
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // Scripts: propio + GA4/GTM + Stripe
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
      // Estilos: propio + inline (Tailwind, Framer Motion)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fuentes
      "font-src 'self' https://fonts.gstatic.com",
      // Imágenes: propio + Unsplash + GA + data URIs
      "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com",
      // Conexiones: propio + GA4 + OpenAI (API calls son server-side, pero por si acaso)
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
      // Iframes: YouTube + Stripe
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://js.stripe.com https://hooks.stripe.com",
      // Medios
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
