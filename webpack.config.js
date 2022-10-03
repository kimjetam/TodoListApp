const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, argv) => {
  const isDevBuild = !(argv && argv.mode === 'production');

  const CSSModuleLoader = {
    loader: isDevBuild ? 'css-loader' : 'css-loader?minimize',
    options: {
      modules: {
        localIdentName: 'tdapp-[name]_[local]'
      }
    }
  };

  return {
    mode: 'development',
    entry: './index.tsx',
    devtool: 'inline-source-map',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'bundle.js'
    },
    devServer: {
      static: './dist'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader',
              options: { configFile: 'tsconfig.json' }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, CSSModuleLoader, 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.css', '.scss']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new MiniCssExtractPlugin()
    ]
  };
};
