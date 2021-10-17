/* eslint-env browser */

const async = require('async');
const request = require('browser-request');

const phuzzy = require('../../main/phuzzy.js');
const querystring = require('querystring');

const R_BROWSE_SOURCE = /^\/browse\/(.+)$/;
const P_DEFAULT_PREFIXES = `${window.location.origin}/asset/context/default`;
const P_DEFAULT_PLUGIN_PACK = `${window.location.origin}/asset/pack/iospress`;
const R_PREFIXED_NAME = /^([^:]+:.*|:.+)$/;
const R_IRI = /^<(.+)>$/;
const R_UNENCLOSED_IRI = /^\w+:\/\//;

const F_STRING = (s) => s;
const F_NUMBER = (x) => +x;

const H_SETTINGS_KEYS = {
	language: F_STRING,
	locale: F_STRING,
	limit: F_NUMBER,
};

function d(...a_args) {
	let d_element;
	let z_arg = a_args.shift();
	if('string' === typeof z_arg) {
		d_element = document.createElement(z_arg);
		z_arg = a_args.shift();
	}
	else {
		d_element = document.createElement('div');
	}

	// properties
	if(Object === z_arg.constructor) {
		Object.assign(d_element, z_arg);
		z_arg = a_args.shift();
	}

	// child nodes
	if(Array.isArray(z_arg)) {
		z_arg.forEach((d_child) => {
			if(d_child) {
				d_element.appendChild(d_child);
			}
		});
	}

	return d_element;
}

// 
function fetch_prefixes(p_prefixes, fk_prefixes, n_redirects=3) {
	// tentative prefix map
	let h_fetch_prefixes = {};

	// download prefix map in json-ld
	request.get({
		url: p_prefixes,
		headers: {
			accept: 'application/ld+json',
		},
	}, (e_req, d_xhr, s_body) => {
		// request failed
		if(e_req) {
			fk_prefixes('prefix map request failed '+e_req);
		}
		// http error
		else if(200 !== d_xhr.statusCode) {
			fk_prefixes('server returned non-200 response');
		}
		// not jsonld
		else if('application/ld+json' !== d_xhr.getResponseHeader('Content-Type')) {
			fk_prefixes('server returned something other than json-ld: '+d_xhr.getResponseHeader('Content-Type'));
		}
		// all good!
		else {
			// try to parse json
			let h_jsonld;
			try {
				h_jsonld = JSON.parse(s_body);
			}
			catch(e_parse) {
				return fk_prefixes('invalid json response from server');
			}

			// fetch context
			let z_context = h_jsonld['@context'];

			// context points to another url
			if('string' === typeof z_context) {
				// recurse into jsonld context url
				fetch_prefixes(z_context, fk_prefixes, n_redirects-1);
			}
			// context is not an object
			else if('object' === typeof z_context) {
				// iterate each key/value pair
				for(let s_prefix in z_context) {
					let z_value = z_context[s_prefix];

					// value is a string; this is a prefix mapping
					if('string' === typeof z_value) {
						// save prefix mapping
						h_fetch_prefixes[s_prefix] = z_value;
					}
				}

				// callback with prefix map
				fk_prefixes(null, h_fetch_prefixes);
			}
			// invalid jsonld
			else {
				fk_prefixes('invalid context');
			}
		}
	});
}

function extract_resource(s_from, b_initial=false) {
	// prep resource
	let p_resource;

	// it is a full iri
	let m_full_iri = R_IRI.exec(s_from);
	if(m_full_iri) {
		p_resource = m_full_iri[1];

		// we could use a prefix instead
		let s_terse = phuzzy.terse(p_resource, h_prefixes);
		if('<' !== s_terse[0]) {
			// redirect
			window.location.hash = s_terse;

			// not part of initial load; cancel load and redo with prefixed name
			if(!b_initial) {
				return null;
			}
		}
	}
	// not a full iri
	else {
		// not a prefixed name
		if(R_UNENCLOSED_IRI.test(s_from)) {
			// retry
			return extract_resource('<'+s_from+'>', b_initial);
		}
		// it is a prefixed name
		else {
			let m_prefixed_name = R_PREFIXED_NAME.exec(s_from);
			if(m_prefixed_name) {
				// extract prefix
				let s_prefix = s_from.split(':', 1)[0];

				// prefix not exist
				if(!h_prefixes[s_prefix]) {
					throw new Error(`no such prefix found in context: ${s_prefix}`);
				}

				// extract name
				let s_name = s_from.substr(s_prefix.length+1);

				// recreate full iri
				p_resource = h_prefixes[s_prefix] + s_name;
			}
			// none of the above
			else {
				throw new Error('failed to decode resource from hash');
			}
		}
	}

	return p_resource;
}


let k_explorer;
let h_configs;
let h_prefixes;

function download_sources(fk_download) {
	// wait for download
	request.get({
		url: '/asset/configs',
	}, (e_req, d_res, s_body) => {
		// request error
		if(e_req) {
			fk_download(e_req);
		}
		// non-200
		else if(200 !== d_res.statusCode) {
			fk_download('non-200 response from server');
		}
		// response ok
		else {
			// parse json
			let h_res;
			try {
				h_res = JSON.parse(s_body);
			}
			catch(e_parse) {
				return fk_download('invalid json response from server');
			}

			// update sources
			h_configs = h_res;

			// callback
			fk_download();
		}
	});
}

function fetch_endpoint_config(p_endpoint, fk_download) {
	// wait for download
	request.get({
		url: '/asset/config/'+p_endpoint,
	}, (e_req, d_res, s_body) => {
		// request error
		if(e_req) {
			fk_download(e_req);
		}
		// non-200
		else if(200 !== d_res.statusCode) {
			fk_download('non-200 response from server');
		}
		// response ok
		else {
			// parse json
			let h_res;
			try {
				h_res = JSON.parse(s_body);
			}
			catch(e_parse) {
				return fk_download('invalid json response from server');
			}

			// callback
			fk_download(null, h_res);
		}
	});
}

function update_status(d_channel) {
	let d_text = d_channel.getElementsByClassName('text')[0];

	return (s_text) => {
		if(s_text) {
			d_text.textContent = s_text;
		}
		else {
			d_text.textContent = d_text.textContent.replace(/^Loaded (\d+) triples.+$/, '$1 triples');
		}
	};
}

document.addEventListener('DOMContentLoaded', () => {
	// extract path
	let s_path = window.location.pathname;

	// set default prefix map url
	let z_prefixes = P_DEFAULT_PREFIXES;

	// set default plugin pack
	let z_plugin_pack = P_DEFAULT_PLUGIN_PACK;

	// settings to be used by any plugin
	let h_settings = {
		language: 'en',
		locale: 'en-US',
		limit: 128,
	};

	// prep endpoint
	let p_endpoint;

	// sort order
	let a_sort_order = [];

	// prep plugins list
	let a_plugins = [];
	let h_plugin_args = {};

	// elements
	let d_controls = document.getElementById('controls');
	let d_configs = d_controls.getElementsByClassName('configs')[0];
	let d_endpoint = d_configs.getElementsByClassName('endpoint')[0];
	let d_endpoint_url = d_endpoint.getElementsByClassName('url')[0];

	let d_prefixes = d_configs.getElementsByClassName('prefixes')[0];
	let d_prefixes_url = d_prefixes.getElementsByClassName('url')[0];

	let d_settings = d_configs.getElementsByClassName('settings')[0];
	let d_plugins = d_configs.getElementsByClassName('plugins')[0];
	let d_status = d_controls.getElementsByClassName('status')[0];

	let d_error = d_status.getElementsByClassName('error')[0];
	let d_overview_outgoing = d_status.getElementsByClassName('outgoing')[0];
	let d_overview_incoming = d_status.getElementsByClassName('incoming')[0];


	// in series
	async.waterfall([
		// determine endpoint and prefixes
		(fk_task) => {
			// fetch endpoint config
			//fetch_endpoint_config('iospress', (e_download, h_source) => {
				// set endpoint url
			//	p_endpoint = '/sparql';
			fetch_endpoint_config('direct-relief-mobility-network', (e_download, h_source) => {
				p_endpoint = '/sparql';

				// endpoint has a config!
				if(!e_download) {
					// set fields
					z_prefixes = h_source.context || z_prefixes;

					// fetch plugin pack name
					z_plugin_pack = h_source.plugins || z_plugin_pack;

					// settings
					h_settings = h_source.settings || h_settings;

					// sort order
					a_sort_order = h_source.order || a_sort_order;
				}

				// done here
				fk_task();
			});
		},

		// override settings with querystring
		(fk_task) => {
			// parse querystring
			let h_query = querystring.parse(window.location.search.substr(1));

			// each querystring arg
			for(let s_key in h_query) {
				let z_value = h_query[s_key];

				// setting
				if(s_key in H_SETTINGS_KEYS) {
					h_settings[s_key] = H_SETTINGS_KEYS[s_key](z_value);
				}
				// non setting
				else {
					switch(s_key) {
						// override endpoint
						case 'endpoint': {
							if(!p_endpoint) p_endpoint = z_value;
							break;
						}
						// set context
						case 'context': {
							z_prefixes = z_value;
							break;
						}
						// other
						default: {
							// plugin setting
							if(s_key.startsWith('plugin.')) {
								let s_plugin = s_key.substr('plugin.'.length);
								let h_value = {};

								if(z_value) {
									try {
										h_value = JSON.parse(decodeURIComponent(z_value));
									}
									catch(e_parse) {
										console.warn('invalid json value in querstring URI component for key '+s_key);
										continue;
									}
								}

								// add plugin args
								h_plugin_args[s_plugin] = h_value;
							}
							// nothing
							else {
								console.warn('querystring argument key not understood: '+s_key);
							}
							break;
						}
					}
				}
			}

			// done here
			fk_task();
		},

		// test endpoint
		(fk_task) => {
			// update settings
			for(let s_key in h_settings) {
				d_settings.appendChild(d({className:'setting'}, [
					d('span', {className:'key', textContent:s_key}),
					d('span', {className:'value', textContent:JSON.stringify(h_settings[s_key])}),
				]));
			}

			// set endpoint
			d_endpoint_url.value = p_endpoint;

			// put in standby
			d_endpoint.classList.add('standby');

			// test endpoint
			request.post({
				url: p_endpoint,
				headers: {
					Accept: 'application/sparql-results+json',
				},
				form: {
					query: 'select * { ?s ?p ?o } limit 1',
				},
			}, (e_query, d_res, s_body) => {
				d_endpoint.classList.remove('standby');

				if(e_query) {
					d_endpoint.classList.add('failure');
					return fk_task('SPARQL endpoint test error: '+e_query);
				}

				if(200 !== d_res.statusCode) {
					d_endpoint.classList.add('failure');
					return fk_task('SPARQL endpoint returned non-200: '+d_res.statusCode+' :: '+s_body);
				}

				// all good
				d_endpoint.classList.add('okay');
				fk_task();
			});
		},

		// load plugin pack
		(fk_task) => {

			// url to plugin pack
			if('string' === typeof z_plugin_pack) {
				// download pack
				request.get({
					url: z_plugin_pack,
					headers: {
						accept: 'application/json',
					},
				}, (e_req, d_res, s_body) => {
					if(e_req) {
						return fk_task(e_req);
					}

					if(200 !== d_res.statusCode) {
						return fk_task('non-200 server response: '+d_res.statusCode+' '+s_body);
					}

					if('application/json' !== d_res.getResponseHeader('Content-Type')) {
						return fk_task('server response header is not content-type application/json');
					}

					// json of plugin initializer
					let a_json;
					try {
						a_json = JSON.parse(s_body);
					}
					catch(e_parse) {
						return fk_task('invalid json response from server');
					}

					// pass to next task
					fk_task(null, a_json);
				});
			}
			// acquired plugin pack directly from config
			else {
				// pass to next task
				fk_task(null, z_plugin_pack);
			}
		},

		// check and load plugins
		(a_pack_plugins, fk_task) => {
			// assert it is an array
			if(!Array.isArray(a_pack_plugins)) {
				return fk_task('json response needs to be an array');
			}

			// add plugins from pack
			a_plugins.push(...a_pack_plugins);

			// make a temporary roster
			let h_plugins_roster = {};
			a_plugins.forEach((h_plugin) => {
				h_plugins_roster[h_plugin.name] = h_plugin;
			});

			// each plugin / arg
			for(let s_plugin in h_plugin_args) {
				// plugin present, extend its args
				if(s_plugin in h_plugins_roster) {
					let h_plugin = h_plugins_roster[s_plugin];
					h_plugin.args = Object.assign(h_plugin.args || {}, h_plugin_args[s_plugin]);
				}
				// there is a plugin missing from the pack, add it
				else {
					a_plugins.push({
						name: s_plugin,
						args: h_plugin_args[s_plugin],
					});
				}
			}

			// update plugins display
			a_plugins.forEach((h_plugin) => {
				let h_args = h_plugin.args || {};
				let a_args = Object.keys(h_args);
				d_plugins.appendChild(d({className:'plugin'}, [
					d({className:'name'}, [
						d('span', {textContent:h_plugin.name, className:'text'}),
						a_args.length? d('span', {
							textContent: `${a_args.length} arg${1===a_args.length?'':'s'}`,
							className: 'summary',
							onclick: function() {
								this.parentNode.parentNode.classList.toggle('expand');
							},
						}): null,
					]),
					d({className:'args'},
						a_args.map((s_key) => d([
							d('span', {textContent:s_key, className:'key'}),
							d('span', {textContent:JSON.stringify(h_args[s_key]), className:'value'}),
						]))
					),
				]));
			});

			// done here
			fk_task();
		},

		// load prefixes
		(fk_task) => {
			// prefixes is given by a url to a json-ld file
			if('string' === typeof z_prefixes) {
				// // turn path into absolute URI
				// if(z_prefixes.startsWith('/')) {
				// 	z_prefixes = 'http://phuzzy.link'+z_prefixes;
				// }

				// update prefixes url and status
				d_prefixes_url.value = z_prefixes;
				d_prefixes.classList.add('standby');

				// fetch prefixes from the url
				fetch_prefixes(z_prefixes, (e_fetch, h_fetched_prefixes) => {
					d_prefixes.classList.remove('standby');

					// failed to fetch context from remote
					if(e_fetch) {
						d_prefixes.classList.add('failure');
						fk_task(e_fetch);
					}
					// success
					else {
						d_prefixes.classList.add('okay');
						fk_task(null, h_fetched_prefixes);
					}
				});
			}
			// prefixes is given as json-ld object
			else if('object' === typeof z_prefixes) {
				// check context
				let h_context = z_prefixes['@context'];
				if('object' !== typeof h_context) {
					fk_task('invalid context in json-ld');
				}

				// forward
				fk_task(null, h_context);
			}
		},

		// continue loading with prefixes
		(h_loaded_prefixes, fk_task) => {
			// update field
			h_prefixes = h_loaded_prefixes;

			// extract resource
			let p_resource = extract_resource(decodeURIComponent(window.location.hash.substr(1)), true);

			// init plugins
			async.map(a_plugins, (h_plugin_info, fk_item) => {
				// ref name
				let s_name = h_plugin_info.name;

				// laod plugin
				async.waterfall([
					// load package
					(fk_task_package) => {
						request.get({
							url: `/asset/plugin/${s_name}`,
							headers: {
								accept: 'application/json',
							},
						}, (e_script, d_xhr, s_json) => {
							let h_assets;
							try {
								h_assets = JSON.parse(s_json);
							}
							catch(e_parse) {
								throw `invalid asset JSON for plugin ${s_name}`;
							}

							// css assets
							let z_assets_css = h_assets.css;
							let h_assets_css = {};

							// single css file
							if('string' === typeof z_assets_css) {
								h_assets_css = [z_assets_css];
							}
							// array of files
							else if(Array.isArray(z_assets_css)) {
								h_assets_css = z_assets_css;
							}

							// forward to asset loader
							fk_task_package(null, {
								css: h_assets_css,
							});
						});
					},

					// load assets
					(h_assets, fk_task_package) => {
						let a_css = h_assets.css;
						if(a_css.length) {
							a_css.forEach((p_css) => {
								document.head.appendChild(Object.assign(document.createElement('link'), {
									id: 'stylesheet_'+s_name,
									rel: 'stylesheet',
									type: 'text/css',
									href: `/asset/plugin/${s_name}/${p_css}`,
								}));
							});
						}

						// done
						fk_task_package();
					},
				], () => {
					// download script
					request.get({
						url: `/asset/plugin/${s_name}/`,
						headers: {
							accept: 'text/javascript',
						},
					}, (e_script, d_xhr, s_script) => {
						// load module
						let h_module = eval(s_script);

						// invoke constructor with args
						let h_plugin_initializer;
						try {
							h_plugin_initializer = h_module.exports(h_settings, h_plugin_info.args);
						}
						catch(e_invoke) {
							fk_item(`failed to invoke plugin '${s_name}'. module must export a function. ${e_invoke}`);
						}

						// not an object
						if('object' !== typeof h_plugin_initializer) {
							fk_item(`plugin '${s_name}' did not return an object`);
						}

						// use setter on id
						h_plugin_initializer.id = s_name;

						// ensure it was set
						if(s_name !== h_plugin_initializer.id) {
							fk_item(`failed to set id on plugin '${s_name}'`);
						}

						// add to map
						fk_item(null, h_plugin_initializer);
					});
				});
			}, (e_map, a_init_plugins) => {
				// map error
				if(e_map) {
					throw e_map;
				}

				// load phuzzy instance
				k_explorer = phuzzy({
					prefixes: h_prefixes,
					endpoint: p_endpoint,
					plugins: a_init_plugins,
					settings: h_settings,
					sort_order: a_sort_order.map((s_rule) => {
						return new RegExp('^'+s_rule.replace(/[.?{}()[\]\-+|\\]/g, '\\$1').replace('*', '.*')+'$');
					}),
					status: {
						outgoing: update_status(d_overview_outgoing),
						incoming: update_status(d_overview_incoming),
					},
				});

				// resource was given
				if(p_resource) {
					// browse resource
					k_explorer.browse(p_resource);
				}
				// default to publisher
				else {
					k_explorer.browse('<http://ld.iospress.nl/rdf/organization/Publisher.IOS_Press>');
				}

				// done here
				fk_task();
			});
		},
	], (e_init) => {
		if(e_init) {
			d_error.classList.add('active');
			d_error.appendChild(d([
				d('span', {className:'title', textContent:'Error while initializing'}),
				d('span', {className:'text', textContent:e_init.toString()}),
			]));
			throw `error while initializing: ${e_init}`;
		}

		// attach event to location.hash change
		window.addEventListener('hashchange', () => {
			// extract resource from hash
			let p_resource = extract_resource(decodeURIComponent(window.location.hash.substr(1)));

			// resource is being tersed to prefixed name; cancel this event
			if(!p_resource) return;

			// jump to top
			scroll(0, 0);

			// load resource to explorer
			k_explorer.browse(p_resource);
		}, false);
	});
});
