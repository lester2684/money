const path2 = require("path");
const nodeExternals = require("webpack-node-externals");
const copyFiles = require("copy-webpack-plugin");

module.exports = {
  entry: "./app.ts",
  target: "node",
  mode: "production",
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader", exclude: /node_modules/ }],
  },
  plugins: [
    new copyFiles({ patterns: [{ from: "../my-app/build", to: "build" }] }),
  ],
  output: {
    path: path2.resolve(__dirname, "dist"),
    filename: "app.js",
  },
};
