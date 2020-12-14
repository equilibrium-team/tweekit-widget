const path = require("path");
const webpack = require("webpack");


const developmentConfig = require('./config/development')
const qaConfig = require('./config/qa')
const productionConfig = require('./config/production')

const generateConfig = (env = 'development') => {
  const ENV_CONFIG = {
    "development": {
      path: path.resolve(__dirname, './_Output/tweekit/debug')
    },
    "qa": {
      path: path.resolve(__dirname, './_Output/tweekit/qa')
    },
    "production": {
      path: path.resolve(__dirname, './_Output/tweekit/release')
    },
  }[env]

  const mode = env === "production" ? "production" : "development"

  let config = {
    mode,
    entry: ["./src/tweekit.js"],
    module: {
      rules: [
          {
              test: /\.(js|jsx)$/,
              exclude: /(node_modules|bower_components)/,
              loader: "babel-loader",
              options: { presets: ["@babel/env"] }
          },
          {
              test: /\.css$/,
              use: ["style-loader", "css-loader"]
          }
      ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: ENV_CONFIG.path,
        publicPath: "./_Output/tweekit/qa",
        filename: "tweekit_bundle.js",
        library: 'TweekIt',
        libraryTarget: 'window',
        libraryExport: 'default'
    },
  }

  const envConfig = {
    development: { ...developmentConfig },
    qa: { ...qaConfig },
    production : { ...productionConfig }
  }[env]

  config = {
    ...config,
    ...envConfig
  }

  return (config)
}


module.exports = (env, argv) => {
  const environmentKey = env ? env.split('=')[1] : "development"
  console.log('COMPILING IN environmentKey === ', environmentKey)
  return generateConfig(environmentKey);
}
