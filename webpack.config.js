const path = require("path");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

module.exports = {
	entry: ["./src/scripts/firebase-config.js", "./src/scripts/calendar.js", "./src/scripts/day-schedule.js", "./src/scripts/schedule.js"],
	output: {
		filename: "static/scripts/main.js",
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"],
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
	],
};
