const webpack = require('webpack')

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            GLBL_PROTOCOL: JSON.stringify("https"),
            GLBL_APIURL: JSON.stringify("dapp-qa.tweekit.io"),
            GLBL_PORT: 443,
        })
    ]
}