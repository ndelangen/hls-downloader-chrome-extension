const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const paths = require("./paths");
const getClientEnvironment = require("./env");
const common = require("./webpack.config.common");
const publicPath = paths.servedPath;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

if (env.stringified["process.env"].NODE_ENV !== '"production"') {
  throw new Error("Production builds must have NODE_ENV=production.");
}

module.exports = {
  bail: true,
  devtool: shouldUseSourceMap ? "source-map" : false,
  entry: common.entry,
  output: common.output,
  resolve: common.resolve,
  module: common.module,
  node: common.node,
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "public"
      }
    ]),
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new webpack.DefinePlugin(env.stringified),
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 6,
        output: {
          comments: false,
          beautify: false
        }
      }
    }),
    new ManifestPlugin({
      fileName: "asset-manifest.json"
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
