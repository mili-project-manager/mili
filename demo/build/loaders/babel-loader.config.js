export default {
  loader: 'babel-loader',
  options: {
    presets: [[
      'env',
      {
        useBuiltIns: true,
        modules: false,
        targets: { browser: ['>5%'] },
      }
    ]],
  },
};
