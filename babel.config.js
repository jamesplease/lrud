const config = {
  test: {
    targets: {
      node: 'current',
    },
  },
  build: {
    targets: {
      browsers: [
        'last 8 chrome version',
        'last 8 firefox version',
        'last 8 safari version',
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
    ],
    presets: [
      ['@babel/preset-env', config[configKey]],
      '@babel/typescript',
      '@babel/preset-react',
    ],
  };
};
