const path = require('path')
const paths = require('./paths.config')
const webpack = require('webpack')

module.exports = {
  entry: [
    path.join(paths.src, 'index.js'),
    path.join(paths.src, 'index.scss')
  ],
  output: {
    publicPath: paths.public,
    filename: '[hash].js',
    chunkFilename: '[hash].[id].chunk.js'
  },
  resolve: {
    alias: paths.aliases
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        include: paths.src
      },
      {
        test: /\.svg$/i,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      h: [path.join(paths.src, 'utils', 'jsx'), 'h']
    })
  ]
}
