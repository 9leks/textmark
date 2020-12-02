const { merge } = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config.js')
const CopyPlugin = require('copy-webpack-plugin')
const ElectronReloaderPlugin = require('electron-reloader-webpack-plugin')

const main = {
  entry: path.resolve(__dirname, 'src/main/index.ts'),
  target: 'electron-main',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'build/main'),
    filename: 'index.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/main/lib/devtools'),
          to: path.resolve(__dirname, 'build/main/lib/devtools'),
        },
      ],
    }),
    new ElectronReloaderPlugin('electron', [
      path.resolve(__dirname, 'build/main/index.js'),
    ]),
  ],
}

const preload = {
  entry: path.resolve(__dirname, 'src/main/preload.ts'),
  target: 'electron-preload',
  output: {
    path: path.resolve(__dirname, 'build/main'),
    filename: 'preload.js',
  },
  plugins: [
    new ElectronReloaderPlugin('electron', [
      path.resolve(__dirname, 'build/main/index.js'),
    ]),
  ],
}

module.exports = [merge(base, main), merge(base, preload)]
