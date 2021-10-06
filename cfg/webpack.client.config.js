const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';

function setupDevtool() {
  if (IS_DEV) {
    return 'eval';
  }
  if (IS_PROD) {
    return false;
  }
}

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      'react-dom': IS_DEV ? '@hot-loader/react-dom' : 'react-dom',
    },
  },
  mode: NODE_ENV ? NODE_ENV : 'development',
  entry: [
    path.resolve(__dirname, '../src/client/index.jsx'),
    'webpack-hot-middleware/client?path=http://localhost:3001/static/__webpack_hmr',  // boilerplate, template string
    // would be added in file ../src/client/index.jsx
  ],
  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: 'client.js',
    publicPath: '/static/',   // give webpack dir with static assets
  },
  module: {
    rules: [{
      test: /\.[tj]sx?$/,
      use: ['ts-loader'],
    }],
  },
  plugins: IS_DEV 
    ? [
      new CleanWebpackPlugin(),   // removes old chunks
      new HotModuleReplacementPlugin(),
    ]
    : [],
  devtool: setupDevtool(),
};