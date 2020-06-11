const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimazeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const config = require('config');

const isProd = process.env.NODE_ENV === 'production';
const PUBLIC = '/public/';
const PATH = !isProd ? 'dist/public' : 'dist/client';
const SERVER_PATH = 'dist/server';

const optimization = () => {

  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimazeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

module.exports = {
  context: path.resolve(__dirname, 'src/client'),
  mode: 'development',
  entry: {
    polyfills: ['@babel/polyfill',
      'url-search-params-polyfill',
      'element-remove',
      'nodelist-foreach-polyfill',
      'custom-event-polyfill',
      'fetch-polyfill',
      'event-propagation-path',
      'intersection-observer',
      'classlist-polyfill',
      'element-scroll-polyfill'
    ],
    main: ['./application.js'],
  },
  output: {
    publicPath: PUBLIC,
    path: path.resolve(__dirname, PATH),
    filename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['.js'],
    // alias: {}
  },
  devServer: {
    hot: true,
    liveReload: true,
    port: config.get('applicationPort.dev-server'),
    contentBase: path.join(__dirname, PATH),
    writeToDisk: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:' + config.get('applicationPort.dev-api')
    }
  },
  optimization: optimization(),
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(
      {
        cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')],
        verbose: true,
        dry: false
      }
    ),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      hmr: !isProd,     
      path: path.resolve(__dirname, PATH),
      filename: '[name].[hash].css',
      chunkFilename: '[id],css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/client/images/favicon.ico'),
          to: path.resolve(__dirname, PATH + '/images/favicon.ico'),
        },
        {
          from: path.resolve(__dirname, 'src/server'),
          to: path.resolve(__dirname, SERVER_PATH),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
          }
        }, 
        'eslint-loader'],
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(svg|png|jpeg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]',
          },
        },
      },
    ],
  },
};
;