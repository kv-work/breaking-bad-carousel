const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');const ghpages = require('gh-pages');

ghpages.publish('dist');

module.exports = (env = {}) => {
  const { production = false } = env;

  const isProd = production;

  // Функция для настройки loader'ов стилей
  function getStyleLoaders() {
    return [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: "[local]--[hash:base64:5]",
          },
        },
      },
    ];
  }

  // Функция для настройки подключаемых plagin'ов
  function getPlugins() {
    const plugins = [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
      }),
    ];

    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: 'style.css'
      }));
    }

    return plugins;
  }

  return {
    mode: isProd ? 'production' : 'development',
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },

        {
          test: /\.css$/,
          use: getStyleLoaders(),
        },

        {
          test: /\.s[ac]ss$/,
          use: [
            ...getStyleLoaders(),
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(png|gif|jpeg|jpg|svg)$/,
          exclude: /fonts/,
          use: [{
            loader: 'file-loader',
            options: {
              publicPath: './img',
              outputPath: 'img',
              name: '[name].[ext]',
            },
          }],
        },
      ],
    },

    plugins: getPlugins(),
  
    devtool: 'inline-source-map',

  }
};
