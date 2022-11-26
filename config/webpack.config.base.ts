import webpack from "webpack";
import webpackPath from "./webpack.path";

import { dependencies as externals } from "../release/app/package.json";

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],
  stats: "errors-only",
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            compilerOption: {
              module: "esnext",
            },
          },
        },
      },
    ],
  },
  output: {
    path: webpackPath.srcPath,
    library: {
      type: "commonjs2",
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [webpackPath.srcPath, "node_modules"],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "production",
    }),
  ],
};

export default configuration;
