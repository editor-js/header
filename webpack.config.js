/**
 * Webpack config
 *
 * @author CodeX Team (team@ifmo.su)
 * @copyright CodeX 2017
 */

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

/**
 * Gets package params
 */
var pkg = require('./package');

/**
 * Define entry point
 */
var entry = './entry.js';

/**
 * Set bundle params
 *
 * filename       - main bundle file from package.json
 * library        - module name from package.json
 * libraryTarget  - "umd" is a way for your library to work with all the module
 *                  definitions (and where aren't modules at all).
 *                  It will work with CommonJS, AMD and as global variable.
 */
var output = {
  filename: pkg.main,
  library: pkg.exportModuleName,
  libraryTarget: 'umd',
};


var useModule = {
  rules: [
    /**
     * Process CSS
     */
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract([
        {
          loader: 'css-loader',
          options: {
            minimize: 1,
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader'
        }
      ])
    },

    /**
     * Process JS files
     */
    {
      test : /\.js$/,
      use: [
        {
          loader: 'eslint-loader',
          options: {
            fix: true
          }
        },
        {
          loader: 'babel-loader',
          query: {
            presets: [ 'es2015' ],
          }
        }
      ]
    }
  ]
};

/**
 * List of plugins to run
 */
var plugins = [
  /** Build separated styles bundle */
  new ExtractTextPlugin({
    filename: './lib/bundle.css',
    allChunks: true,
  }),

  /** Minify JS and CSS */
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  }),

  /** Block biuld if errors found */
  new webpack.NoEmitOnErrorsPlugin(),
];

/**
 * Final webpack config
 */
var config = {
  entry: entry,
  output: output,
  module: useModule,
  plugins: plugins,
  watch: true,
  devtool: 'source-map'
};

module.exports = config;
