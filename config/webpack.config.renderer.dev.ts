// 开发环境 渲染进程的配置
import "webpack-dev-server";
import path from "path";
import fs from "fs";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { merge } from "webpack-merge";
import { execSync, spawn } from "child_process";
import baseConfig from "./webpack.config.base";
import webpackPath from "./webpack.path";

const port = process.env.PORT || 8080;

const configuration: webpack.Configuration = {
  devtool: "inline-source-map",
  mode: "development",
  target: ["web", "electron-renderer"],
  entry: [
    `webpack-dev-server/client?http://localhost:${port}/dist`,
    "webpack/hot/only-dev-server",
    path.join(webpackPath.srcPath, "index.tsx"),
  ],
  output: {
    path: webpackPath.distRendererPath,
    publicPath: "/",
    filename: "renderer.dev.js",
    library: {
      type: "umd",
    },
  },
  module: {
    rules: [
      {
        test: /\.s?css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          "sass-loader",
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      // Images
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      // SVG
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
          "file-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new HtmlWebpackPlugin({
      filename: path.join("index.html"),
      template: path.join(webpackPath.rendererPath, "index.ejs"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
      env: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV !== "production",
      nodeModules: webpackPath.appNodeModulesPath,
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
  devServer: {
    port,
    compress: true,
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    static: {
      publicPath: "/",
    },
    historyApiFallback: {
      verbose: true,
    },
    setupMiddlewares(middlewares) {
      console.log("starting preload");
      const preloadProcess = spawn("npm", ["run", "start:preload"], {
        shell: true,
        stdio: "inherit",
      })
        .on("close", function (code: number) {
          process.exit(code!);
        })
        .on("error", (err) => console.log(err));

      console.log("starting main process...");
      let args = ["run", "start:main"];
      if (process.env.MAIN_ARGS) {
        args = args.concat(
          ["--", ...process.env.MAIN_ARGS.matchAll(/"[^"]+"|[^\s"]/g)].flat()
        );
      }
      spawn("npm", args, {
        shell: true,
        stdio: "inherit",
      })
        .on("close", (code: number) => {
          preloadProcess.kill();
          process.exit(code!);
        })
        .on("error", (err) => console.log(err));
      return middlewares;
    },
  },
};

export default merge(baseConfig, configuration);
