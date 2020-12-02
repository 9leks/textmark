const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config.js')

const renderer = {
  entry: path.resolve(__dirname, 'src/renderer/index.tsx'),
  target: 'web',
  resolve: {
    extensions: ['.tsx', '.scss'],
  },
  output: {
    path: path.resolve(__dirname, 'build/renderer'),
    filename: 'index.js',
  },
  devServer: {
    static: path.resolve(__dirname, 'build/renderer'),
    port: 4000,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/renderer/index.html'),
    }),
  ],
}

module.exports = merge(base, renderer)
