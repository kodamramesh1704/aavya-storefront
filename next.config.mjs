/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  // Always render metadata in <head> (not streamed) so every crawler and audit tool sees it.
  htmlLimitedBots: /.*/,
};
export default nextConfig;
