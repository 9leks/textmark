const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config.js')

const view = {
  entry: path.resolve(__dirname, 'src/view/view.main.tsx'),
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build/view'),
    filename: 'view.main.js',
  },
  devServer: {
    port: 8000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/view/view.index.html'),
    }),
  ],
}

module.exports = merge(base, view)
