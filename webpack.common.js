const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// see https://webpack.js.org/configuration/
module.exports = {
  entry: {
    background: './src/background.ts',
    app: './src/app.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        },
        exclude: /node_modules/,
      },
      {
        // see https://vue-loader.vuejs.org/guide/#manual-setup
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.vue', '.js']
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
