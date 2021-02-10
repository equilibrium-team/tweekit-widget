const path = require("path");
const webpack = require("webpack");
const { version } = require('./package.json');


const developmentConfig = require('./config/development')
const qaConfig = require('./config/qa')
const productionConfig = require('./config/production')

const MODULE_BANNER = `
  ======================================================
          TWEEKIT WIDGET VERSION ${version}
  ======================================================
`

const generateConfig = (env = 'development') => {
  const [ buildMode , isNPM ] = env.split('-')
  const ENV_IS_NPM = isNPM === 'npm';

  const ENV_OUTPUTFOLDER = isNPM
    ? './dist'
    : './_Output/tweekit'

  const ENV_CONFIG = {
    "development": {
      path: path.resolve(__dirname, `${ENV_OUTPUTFOLDER}/debug`)
    },
    "qa": {
      path: path.resolve(__dirname, `${ENV_OUTPUTFOLDER}/qa`)
    },
    "production": {
      path: path.resolve(__dirname, `${ENV_OUTPUTFOLDER}/release`)
    },
  }[buildMode]

  const mode = env === "production" ? "production" : "development";

  const config_output = ENV_IS_NPM
    ? {
      libraryTarget: 'umd',
    }
    : {
      libraryTarget: 'window',
      libraryExport: 'default'
    }

  const npmEssentialsKeys = ENV_IS_NPM ? {
    externals: [{
      croppie: {
        root: 'croppie',
        commonjs2: 'croppie',
        commonjs: 'croppie',
        amd: 'croppie',
        umd: 'croppie',
      },
      'js-base64': {
        root: 'js-base64',
        commonjs2: 'js-base64',
        commonjs: 'js-base64',
        amd: 'js-base64',
        umd: 'js-base64',
      }
    }]
  }: {}

  let config = {
    mode,
    target: 'node',
    entry: {
      "tweekit-widget": "./src/tweekit.js"
    },
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
        filename: "[name].min.js",
        library: 'TweekIt',
        ...config_output
    },
    ...npmEssentialsKeys
  }

  const envConfig = {
    development: { ...developmentConfig },
    qa: { ...qaConfig },
    production : { ...productionConfig },
    "development-npm": { ...developmentConfig },
    "qa-npm": { ...qaConfig },
    "production-npm" : { ...productionConfig }
  }[env]

  config = {
    ...config,
    ...envConfig
  }

  config.plugins.push(new webpack.BannerPlugin(MODULE_BANNER))


  console.log(JSON.stringify(config,null,2))

  return (config)
}


module.exports = (env, argv) => {
  const environmentKey = env ? env.split('=')[1] : "development"
  console.log('COMPILING IN environmentKey === ', environmentKey)
  return generateConfig(environmentKey);
}
