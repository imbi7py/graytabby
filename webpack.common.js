const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// see https://webpack.js.org/configuration/
module.exports = {
  entry: {
    background: './src/background.ts',
    app: './src/app.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin([
      {from: 'manifest.json', to: 'manifest.json'},
      {from: 'assets', to: 'assets'},
      {from: 'src/*.html', to: '', flatten: true}
    ])
  ]
};
