module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
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
