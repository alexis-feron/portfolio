module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  compress: true,
  productionBrowserSourceMaps: true,
  pageExtensions: ['page.js', 'api.js'],
  compiler: {
    removeConsole: true,
  },
  images: { formats: ['image/avif', 'image/webp'] },
  webpack(config, { isServer }) {
    if (isServer) require('./scripts/draco');

    config.module.rules.push(
      { test: /\.svg$/, resourceQuery: { not: [/url/] }, use: ['@svgr/webpack'] },
      { test: /\.(mp4|glb|woff|woff2)$/i, type: 'asset/resource' },
      { resourceQuery: /url/, type: 'asset/resource' },
      { test: /\.glsl$/, type: 'asset/source' }
    );
    return config;
  },
};
