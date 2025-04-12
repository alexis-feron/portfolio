module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    '@tailwindcss/postcss': {},
    'postcss-nesting': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    },
  },
};
