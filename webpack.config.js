const path = require("path");

/* PLUGINS */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractWebpackPugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCSSWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDevelopment = process.env.NODE_MODE === "development";
const isProduction = process.env.NODE_MODE === "production";

/* Setup Dev Server for development on port: env.DEV_SERVER_PORT or 3000 */
const setupDevServer = () => {
  if (isDevelopment) {
    return {
      contentBase: path.resolve(__dirname, "dist"),
      port: process.env.DEV_SERVER_PORT || 3000,
      compress: true,
      open: true,
    };
  }
};

/* Setup Optimization Webpack with Css, JS Minimizer on production */
const setupOptimization = () => {
  const defaultConfig = {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  };

  if (isProduction) {
    defaultConfig.minimizer = [
      new OptimizeCSSWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return defaultConfig;
};

/* List of css loaders  */
const cssLoaders = (extra) => {
  let loaders = [
    {
      loader: MiniCSSExtractWebpackPugin.loader,
      options: {
        publicPath: "",
      },
    },
    "css-loader",
    "postcss-loader",
  ];

  if (extra) {
    loaders = [...loaders, ...extra];
  }

  return loaders;
};

const setupPlugins = () => {
  let defaultPlugins = [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./index.html",
      minify: {
        collapseWhitespace: isProduction,
      },
    }),
    new HtmlWebpackPlugin({
      filename: "checkout.html",
      template: "./checkout.html",
      minify: {
        collapseWhitespace: isProduction,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/images"),
          to: path.resolve(__dirname, "dist/assets/images"),
        },
      ],
    }),
    new MiniCSSExtractWebpackPugin({
      filename: "index.css",
    }),
  ];

  return defaultPlugins;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  performance: {
    maxAssetSize: 249856,
  },
  optimization: setupOptimization(),
  devServer: setupDevServer(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders(["resolve-url-loader", "sass-loader"]),
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: "file-loader",
        options: {
          outputPath: "assets/fonts",
          name: "[name].[ext]",
        },
      },
    ],
  },
  plugins: setupPlugins(),
};
