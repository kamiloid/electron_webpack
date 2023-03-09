const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let debug = true;
let mode = 'development';

module.exports = ( env, options )=>
{
	return {
		entry: [`${__dirname}/src/main.js`, `${__dirname}/src/app/app.scss`],
		output: {
			path: path.resolve(__dirname, './dist'),
			filename: 'index_bundle.js',
			chunkFilename: '[id].js',
			publicPath: './dist'
		},
		devServer: {
		    headers: {
		      "Access-Control-Allow-Origin": "*",
		      "Access-Control-Allow-Credentials": "true",
		      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
		      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
		    }
		},
		module:{
			rules: [
				{
					test: /.\js$/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets:['@babel/preset-env']
							}
						}
					]
				},
				{
					test: /\.html$/,
					use: ['html-loader']
				},
				{
					test: /\.(jpe?g|png|gif)$/i,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								publicPath: 'assets',
								outputPath: (url, resourcePath, context) =>
								{
									const root = path.relative(context, resourcePath);
									const subpath = root.substr(root.indexOf('assets'), root.length);
									return subpath;
								},
								useRelativePath: true,
								emitFile: true
							}
						}
					]
				},
				{
					test: /\.(css|s[ac]ss)$/i,
					use: [{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: './dist'
						}
					}, 'css-loader', 'sass-loader']
				},
				{
					test: /\.svg$/i,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								publicPath: 'assets',
								outputPath: (url, resourcePath, context) =>
								{
									const root = path.relative(context, resourcePath);
									const subpath = root.substr(root.indexOf('assets'), root.length);
									return subpath;
								},
								emitFile: true
							}
						}
					]
				},
				{
					test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: (file)=> {
									return '[name].[ext]';
								},
								publicPath: 'assets',
								outputPath: (url, resourcePath, context) =>
								{
									const root = path.relative(context, resourcePath);
									const subpath = root.substr(root.indexOf('assets'), root.length);
									return subpath;
								},
							}
						}
					]
				}
			]
		},
		plugins:[
			new MiniCssExtractPlugin({filename: debug ? 'css/app.css' : 'css/styles-[contenthash].css', chunkFilename: 'css/[id].css'}),

			new HtmlWebpackPlugin({
				hash: true,
				title: 'CTI Ecom',
				meta: {
					description: 'CTI Ecom',
					viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
					charset: 'utf-8',
					title: 'CTI Ecom',
				},
				template: './src/index.html',
				filename: 'index.html',
				inject: 'body'
			})
		],
		mode: options.mode ? 'development' : 'production',
		output: {
			clean: true
		},
		// resolve: {
		// 	extensions: ['.js', '.css']
		// },
		optimization: {
			minimize: debug ? false : true
		}
	}
}
