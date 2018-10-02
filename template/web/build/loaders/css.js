// this matches `<style module>`
const cssModuleLoader = {
  resourceQuery: /module/,
  use: [
    'vue-style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: '[local]_[hash:base64:5]'
      }
    },
    'postcss-loader',
  ]
}

// this matches plain `<style>` or `<style scoped>`
const cssLoader = {
  use: [
    'vue-style-loader',
    {
      loader: 'css-loader',
      options: { importLoaders: 1 },
    },
    'postcss-loader',
  ]
}

export default {
  test: /\.(css|postcss)$/,
  oneOf: [cssModuleLoader, cssLoader],
}
