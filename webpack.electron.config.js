const { merge } = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config.js')

const main = {
  entry: path.resolve(__dirname, 'src/electron/electron-main.ts'),
  experiments: { topLevelAwait: true },
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, 'build/electron'),
    filename: 'electron-main.js',
  },
}

const preload = {
  entry: path.resolve(__dirname, 'src/electron/electron-preload.ts'),
  target: 'electron-preload',
  output: {
    path: path.resolve(__dirname, 'build/electron'),
    filename: 'electron-preload.js',
  },
}

module.exports = [merge(base, main), merge(base, preload)]
