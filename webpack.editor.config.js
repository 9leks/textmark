const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config.js')

const editor = {
  entry: path.resolve(__dirname, 'src/editor/index.tsx'),
  target: 'web',
  resolve: {
    extensions: ['.tsx', '.css']
  },
  output: {
    path: path.resolve(__dirname, 'build/editor'),
    filename: 'index.js'
  },
  devServer: {
    static: path.resolve(__dirname, 'build/editor'),
    port: 4000
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/editor/index.html')
    })
  ]
}

module.exports = merge(base, editor)
