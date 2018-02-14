var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')
var config = require('config')
var fs = require('fs')
var NodemonPlugin = require('nodemon-webpack-plugin')

var isProduction = process.env.NODE_ENV === 'production'
var productionPluginDefine = isProduction ? [
  new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}})
] : [new NodemonPlugin()]
var clientLoaders = isProduction ? productionPluginDefine.concat([
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false })
]) : []

var commonLoaders = [
  {
    test: /\.json$/,
    loader: 'json-loader'
  }
]

// Make node-config available
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

if (!fs.existsSync('./dist/config')) {
  fs.mkdirSync('./dist/config')
}

fs.writeFileSync(path.resolve(__dirname, './dist/config/default.json'), JSON.stringify(config))

module.exports = [{
  entry: './index.js',
  output: {
    path: './dist',
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  externals: nodeExternals(),
  plugins: productionPluginDefine,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      }
    ].concat(commonLoaders)
  }
}, {
  entry: './src/ui/widget/browser.js',
  output: {
    path: './dist/assets',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: clientLoaders.concat([
    new ExtractTextPlugin('index.css', {
      allChunks: true
    })
  ]),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}]
