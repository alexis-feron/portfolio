/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  compress: true,
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: true,
  },
  images: { formats: ['image/avif', 'image/webp'] },
  webpack(config) {
    config.module.rules.push(
      { test: /\.svg$/, resourceQuery: { not: [/url/] }, use: ['@svgr/webpack'] },
      { test: /\.(mp4|glb|woff|woff2)$/i, type: 'asset/resource' },
      { resourceQuery: /url/, type: 'asset/resource' },
      { test: /\.glsl$/, type: 'asset/source' },
      { test: /\.wasm$/, type: 'webassembly/experimental' }
    );
    return config;
  },
};
