const path = require("path");
const fs = require("fs");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require('dotenv-webpack');

/* variables */
/* global process __dirname module */
const isProduction = process.argv.indexOf("-p") >= 0;
const PAGE_DIR = path.join("src", "pages", path.sep);

/**
 *  more info for multi-page webpack you can follow the link
 *  @link: https://itnext.io/building-multi-page-application-with-react-f5a338489694 */
function getFilesFromDir(dir, fileTypes) {
  const filesToReturn = [];
  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (let i in files) {
      const curFile = path.join(currentPath, files[i]);
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile);
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile);
      }
    }
  }
  walkDir(dir);
  return filesToReturn;
}

const jsFiles = getFilesFromDir(PAGE_DIR, [".js", ".ts"]);
const entry = jsFiles.reduce((obj, filePath) => {
  const entryChunkName = filePath.replace(path.extname(filePath), "").replace(PAGE_DIR, "");
  obj[entryChunkName] = `./${filePath}`;
  return obj;
}, {});


const htmlFiles = getFilesFromDir(PAGE_DIR, [".html"]);
const htmlPlugins = htmlFiles.map(filePath => {
  const fileName = filePath.replace(PAGE_DIR, "");
  return new HtmlWebpackPlugin({
    chunks: [fileName.replace(path.extname(fileName), ""), "vendor"],
    template: filePath,
    filename: fileName,
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    },
  });
});

// babel config
const babelLoaderConfig = {
  loader: "babel-loader",
  options: { babelrc: true },
};

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].[hash:4].js"
  },
  module: {
    rules: [
      // .js, .ts
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: [babelLoaderConfig],
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(svg|gif|jpe?g|png|eot|ttf|woff2?)$/,
        loader: "url-loader",
        exclude: /node_modules/,
        options: {
          esModule: false,
          outputPath: (url, resourcePath, context) => {
            if (!isProduction) {
              const relativePath = path.relative(context, resourcePath);
              return `/${relativePath}`;
            }
            return `assets/${path.basename(resourcePath)}`;
          },
          /* TODO work around to fix image in development enviroment */
          limit: isProduction ? 3000 : 99999,
          publicPath: isProduction ? "../" : '/',// Take the directory into account
          name: `assets/[name].[ext]`,
        },
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new CleanWebpackPlugin(),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: "[name][chunkhash:4].css",
      chunkFilename: "[name].[chunkhash:4].css",
    }),
  ],
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
};
