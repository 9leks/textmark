const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config.js')

const web = {
  entry: path.resolve(__dirname, 'src/web/index.tsx'),
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build/web'),
    filename: 'index.js',
  },
  devServer: {
    port: 8000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/web/index.html'),
    }),
  ],
}

module.exports = merge(base, web)
