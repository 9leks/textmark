const { merge } = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config.js')
const CopyPlugin = require('copy-webpack-plugin')
const ElectronReloaderPlugin = require('electron-reloader-webpack-plugin')

const electronReloader = new ElectronReloaderPlugin('electron', [
  path.resolve(__dirname, 'build/code/main.js'),
])

const main = {
  entry: path.resolve(__dirname, 'src/code/main.ts'),
  target: 'electron-main',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'build/code'),
    filename: 'main.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/code/lib/devtools'),
          to: path.resolve(__dirname, 'build/code/lib/devtools'),
        },
      ],
    }),
    electronReloader,
  ],
}

const preload = {
  entry: path.resolve(__dirname, 'src/code/preload.ts'),
  target: 'electron-preload',
  output: {
    path: path.resolve(__dirname, 'build/code'),
    filename: 'preload.js',
  },
  plugins: [electronReloader],
}

module.exports = [merge(base, main), merge(base, preload)]
