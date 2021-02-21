const config = {
  test: {
    targets: {
      node: 'current',
    },
  },
  build: {
    targets: {
      browsers: [
        'last 4 chrome version',
        'last 4 firefox version',
        'last 2 safari version',
      ],
    },
    modules: false,
  },
};

module.exports = api => {
  const isTest = api.env('test');
  const configKey = isTest ? 'test' : 'build';

  return {
    plugins: [
      '@babel/plugin-transform-react-jsx',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-destructuring',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      "@babel/plugin-proposal-optional-chaining"
    ],
    presets: [
      ['@babel/preset-env', config[configKey]],
      '@babel/typescript',
      '@babel/preset-react',
    ],
  };
};
