const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const FileLoader = {
	loader: 'file-loader',
	options: {
		outputPath: '../dist/'
	}
};

module.exports = function(env){
	return {
		mode: env.mode,
		watch: false,
		devtool: 'source-map',
		entry: {
			benner: './content/entry/benner.entry.js'
		},
		output: {
			filename: '[name].min.js',
			chunkFilename: '[name].min.js',
			path: path.resolve(__dirname, '../../content/js')
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader'
					]
				},
				{
					test: /\.(png|jpeg|jpg|gif)$/,
					use: FileLoader
				},
				{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]+\.[0-9]+)?$/,
					use: {
						loader: 'url-loader',
						options: {
							limit: 4096,
							mimetype: 'application/font-woff',
							outputPath: '../dist/'
						}
					}
				},
				{
					test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]+\.[0-9]+)?$/,
					use: FileLoader
				}
			]
		},
		resolve: {
			extensions: ['.js', '.vue', '.jsx', '.json', '.css'],
			alias: {
				'~': path.resolve('./')
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				_: 'lodash',
				App: '~/content/assets/global/scripts/app.js'
			}),
			new MiniCssExtractPlugin({
				filename: '../css/[name].min.css',
				chunkFilename: '../css/[name].min.css'
			})
        ]
	};
};