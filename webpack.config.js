let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let conf = {
  entry: './components/login.js',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'main.js',
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
          })
      },
      {
        test: /.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  devServer: {
    overlay: true
  },
  devtool: 'eval-sourcemap',
  plugins: [
    new ExtractTextPlugin('style.css')
  ]
};

module.exports = conf;