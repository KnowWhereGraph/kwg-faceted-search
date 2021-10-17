const fs = require('fs');

const files = (pd_src, r_ext=/$/) => fs.readdirSync(pd_src)
	.filter(s => r_ext.test(s))
	.reduce((h_dir, s_file) => ({
		...h_dir,
		[s_file.replace(r_ext, '')]: pd_src+'/'+s_file,
	}), {});

let h_layouts = files('src/webapp/_layouts', /\.pug$/);
let h_scripts = files('src/webapp/_scripts', /\.js$/);
let h_styles = files('src/webapp/_styles', /\.less$/);

module.exports = {
	defs: {
		layout: Object.keys(h_layouts),

		script: Object.keys(h_scripts),

		style: Object.keys(h_styles),
	},

	tasks: {
		all: 'build/**',
	},

	outputs: {
		build: {
			main: {
				'phuzzy.js': () => ({
					copy: 'src/main/phuzzy.js',
				}),
			},

			webapp: {
				_layouts: {
					':layout.html': ({layout:s_layout}) => ({
						deps: [
							h_layouts[s_layout],
						],
						run: /* syntax: bash */ `
							npx pug --pretty < $1 > $@
						`,
					}),
				},

				_scripts: {
					':script.js': ({script:s_script}) => ({
						deps: [
							h_scripts[s_script],
						],
						run: /* syntax: bash */ `
							npx browserify $1 --debug > $@
						`,
					}),
				},

				_styles: {
					':style.css': ({style:s_style}) => ({
						deps: [
							h_styles[s_style],
						],
						run: /* syntax: bash */ `
							npx less - < $1 > $@
						`,
					}),
				},
			},
		},
	},
};
