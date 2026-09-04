// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
// };

// module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Removes the `X-Powered-By: Next.js` response header — Lighthouse's
    // Best Practices audit flags leaking framework/version info, and it's
    // one fewer thing for an attacker to fingerprint for free.
    poweredByHeader: false,
    compress: true,

    // Named imports from these packages (`import { X } from "lucide-react"`)
    // pull in the WHOLE package's barrel file unless Next specifically
    // knows to rewrite them into per-icon/per-component imports at build
    // time. This app imports many individual lucide-react icons across
    // dozens of files — without this, all of them (and every recharts
    // sub-module) ship in the bundle regardless of which icons a given
    // page actually renders. This is very likely the single biggest
    // contributor to the "~649 KiB of unused JavaScript" Lighthouse flagged
    // on the marketing pages, which only ever use a handful of icons each.
    experimental: {
        optimizePackageImports: [ "lucide-react", "recharts", "date-fns" ],
    },

    images: {
        // Cloudinary-hosted user uploads (org logos, product images, shop
        // logos, avatars) — lets next/image optimize them where it's used.
        // The topbar/avatar previews intentionally use plain <img> instead
        // (see Topbar.tsx) since they're tiny, fixed-size thumbnails where
        // next/image's overhead isn't worth it, but anywhere else in the
        // app that adopts next/image for these URLs needs this configured.
        remotePatterns: [ { protocol: "https", hostname: "res.cloudinary.com" } ],
    },
};

module.exports = nextConfig;
