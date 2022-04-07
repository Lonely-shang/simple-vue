/** @format */

// eslint-disable-next-line no-undef
module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'], //定义文件继承的子规范
	plugins: ['@typescript-eslint'], //定义了该eslint文件所依赖的插件
	env: {
		// browser: true,
		// node: true,
		node: true,
		browser: true,
		commonjs: true,
		amd: true
	},
}
