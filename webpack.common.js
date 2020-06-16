const 	path = require('path'),
		MiniCssExtractPlugin = require('mini-css-extract-plugin'),
		OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
		TerserPlugin = require('terser-webpack-plugin'),
		wpdefaults = require("@wordpress/scripts/config/webpack.config");			// https://javascriptforwp.com/adding-react-to-a-wordpress-theme-tutorial/


const config = {
	...wpdefaults,
	externals: {
		"react" : "React",
		"react-dom" : "ReactDOM"
	},
	context: __dirname,
	entry: {
		main: './assets/src/js/main.js'
	},
	output: {
		path: path.resolve(__dirname, 'assets/public'),
		filename: './js/[name].min.js',
		sourceMapFilename: './js/[name].js.map'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'] // https://babeljs.io/docs/en/
					}
				}
			},
			{
				test: /\.module\.s(a|c)ss$/,
				loader: [
					MiniCssExtractPlugin.loader,
					{
					loader: 'css-loader',
					options: {
						modules: true,
						localIdentName: '[name]__[local]___[hash:base64:5]',
						camelCase: true,
						sourceMap: true,
						minimize: true
					}
				},
				{
					loader: 'sass-loader',
					options: {
						sourceMap: true
					}
				  }
				]
			},
			{
				test: /\.s(a|c)ss$/,
				exclude: /\.module.(s(a|c)ss)$/,
				loader: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ya?ml$/,
				include: path.resolve('data'),
				loader: 'yaml',
			},
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.scss']
	},
	plugins: [
		new MiniCssExtractPlugin({
		  filename: './css/[name].min.css',
		  chunkFilename: './css/[id].css',
		  devtool: 'source-map'
		})
	],
	optimization: {
		minimizer: [
			new TerserPlugin(),
			new OptimizeCssAssetsPlugin({ cssProcessorOptions: { map: { inline: false, annotation: true, } } })
		]
	}
};

module.exports = config;