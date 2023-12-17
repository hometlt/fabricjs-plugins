const path = require('path');

module.exports = {
    devtool: "source-map",
    mode: "development",
    optimization: {
        minimize: false
    },
    entry: './src/demo.ts',
    // entry: './src/lib.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        // filename: 'lib.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: path.join(__dirname, "dist"),
        compress: true,
        port: 4000,
    },
};
