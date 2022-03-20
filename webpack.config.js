const path = require("path");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: {
		calendar: ["./src/scripts/calendar.js", "./src/styles/calendar.scss"],
		"day-schedule": "./src/scripts/day-schedule.js",
		schedule: "./src/scripts/schedule.js",
		login: "./src/scripts/login.js",
		register: "./src/scripts/register.js",
		chart: "./src/scripts/chart.js",
	},
	output: {
		filename: "static/scripts/[name].js",
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
			{
				test: /\.scss$/,
				use: [
					// fallback to style-loader in development
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
		],
	},
	mode: "development",
	watch: true,
	watchOptions: {
		ignored: ["/node_modules/", "/Extra/", "/dist/"],
	},
	plugins: [
		new MomentLocalesPlugin({
			localesToKeep: ["es-us", "es-in"],
		}),
		new MiniCssExtractPlugin({
			filename: "static/styles/[name].css",
		}),
	],
};
