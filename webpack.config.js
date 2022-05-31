import webpackNodeExternals from "webpack-node-externals";
import WebpackObfuscatorPlugin from "webpack-obfuscator";
import path from "path";

const config = {
  entry: "./app.js",
  externals: [webpackNodeExternals()],
  devtool: "source-map",
  output: {
    path: path.join(path.resolve(), "dist"),
    filename: "./main.cjs",
    publicPath: "/",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "./node_modules/babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },

      {
        test: /\.js$/,
        enforce: "post",
        use: {
          loader: WebpackObfuscatorPlugin.loader,
          options: {
            rotateStringArray: true,
          },
        },
      },
    ],
  },
  plugins: [
    new WebpackObfuscatorPlugin({
      rotateStringArray: true,
    }),
  ],
};

export default config;
