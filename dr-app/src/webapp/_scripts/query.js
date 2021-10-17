const graphy = require('graphy');
const webtorrent = require('webtorrent');
const buffer = require('buffer');
// const work = require('webworkify');
const request = require('request');
const readable_stream = require('readable-stream');

// ace
const ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');

// // jquery & plugins
const $ = require('jquery-browserify');
// global.jQuery = $;
// require('jquery-ui');
// require('jquery-ui/ui/widgets/progressbar');

class progress {
	constructor() {
		// new progress bar
		let d_progress_bar = dd('.bar');
		let d_progress_info = dd('.info');
		let d_progress = dd('.progress', [
			d_progress_bar,
			d_progress_info,
		]);

		// new status bar
		let d_status_info = dd('.info');
		let d_status = dd('.status', [
			d_progress,
			d_status_info,
		]);

		//
		let d_overview = dd('.overview');

		// clear other progress bars
		let d_monitor = document.getElementById('monitor');
		while(d_monitor.lastChild) {
			d_monitor.removeChild(d_monitor.lastChild);
		}

		// append to controls
		document.getElementById('monitor').appendChild(d_overview);
		document.getElementById('monitor').appendChild(d_status);

		Object.assign(this, {
			element: {
				progress_bar: d_progress_bar,
				progress_info: d_progress_info,
				progress: d_progress,
				status_info: d_status_info,
				status: d_status,
				overview: d_overview,
			},
		});
	}

	update(h_info) {
		let {
			progress_bar: d_progress_bar,
			progress_info: d_progress_info,
			status_info: d_status_info,
			overview: d_overview,
		} = this.element;

		// set progress bar width & text
		if('number' === typeof h_info.progress) {
			d_progress_bar.style.width = `${format.percent(h_info.progress, 1)}`;
			d_progress_info.textContent = `${format.percent(h_info.progress, 2)} downloaded...`;
		}
		else {
			d_progress_bar.style.width = '0%';
			d_progress_info.textContent = '';
		}

		// update status
		d_status_info.textContent = h_info.info || '';

		// and overview
		d_overview.textContent = h_info.overview || '';
	}
}

// const kw_downloader = work(require('./socket-downloader.js'));
// const kw_seeder = work(require('./torrent-seeder.js'));

// for fallback download
function setup_fallback(h_dataset) {
	let k_progress;
	let n_size = 0;

	kw_downloader.addEventListener('message', (d_msg) => {
		let h_data = d_msg.data;
		switch(h_data.event) {
			// deconstruct-assign metadata
			case 'metadata': {
				({
					size: n_size,
				} = h_data.metadata);
				break;
			}

			case 'progress': {
				// how many bytes have been read
				let n_progress = h_data.progress;

				// update progress
				if(n_progress === n_size) {
					k_progress.update({
						progress: 1,
						overview: 'Transferring buffer to main thread...',
					});
				}
				else {
					k_progress.update({
						progress: n_progress / n_size,
						overview: 'Downloading file directly from server...',
						info: `${format.mebibytes(n_progress)} / ${format.mebibytes(n_size)} `,
					});
				}
				break;
			}

			case 'dataset': {
				// update progress
				k_progress.update({
					overview: 'Loading dataset into memory...',
					progress: 1,
				});

				// allow DOM update to occur
				setTimeout(() => {
					// convert array buffer into node buffer
					let ab_contents = buffer.Buffer.from(h_data.buffer);

					// recreate client
					y_torrent_client = new webtorrent();

					// seed dataset
					let y_torrent_pre = y_torrent_client.add(null, {
						name: h_dataset.fallback+'.dti',
					}, (y_torrent) => {
						let nl_piece = y_torrent.pieceLength;
						let n_pieces = Math.ceil(ab_contents.byteLength / nl_piece);
						let i_start = 0;
						let i_end = nl_piece;

						// put contents into store
						for(let i_piece=0; i_piece<n_pieces; i_piece++) {
							// piece and bitfields
							y_torrent.pieces[i_piece] = null;
							y_torrent._reservations[i_piece] = null;
							y_torrent.bitfield.set(i_piece, true);

							// put store chunk
							y_torrent.store.put(i_piece, ab_contents.slice(i_start, i_end));

							// next chunk's buffer indexes
							i_start = i_end;
							i_end += nl_piece;
						}

						// thanks for seeding!
					});

					// cast torrent data from base64 encoded string to buffer
					let ab_torrent = buffer.Buffer.from(h_dataset.torrent, 'base64');

					// init torrent
					y_torrent_pre._onTorrentId(ab_torrent);

					// load into graph
					load_file(ab_contents);
				});
				break;
			}

			default: {
				debugger;
			}
		}

		// let ab_file = buffer.Buffer.from(d_msg.data);
		// load_file(ab_file);
	});

	// give cancel option
	let d_fallback = dd('#fallback:Cancel peer-to-peer and download directly from server');

	document.getElementById('monitor').appendChild(d_fallback);

	d_fallback.classList.remove('hide');
	d_fallback.addEventListener('click', () => {
		// take over progress bar
		k_progress = new progress();

		// stop torrenting
		y_torrent_client.destroy();

		// make progress update
		k_progress.update({
			overview: 'Switching to fallback option...',
		});

		kw_downloader.postMessage({
			download: h_dataset.fallback,
		});
	});
}

// // graphy plugins
// const data_numbers = require('graphy/dist/store/plugin-numbers.js');
// const data_languages = require('graphy/dist/store/plugin-languages.js');

const N_FALLBACK_DELAY = 1000;

const H_PREFIXES = {
	dbo: 'http://dbpedia.org/ontology/',
	dbp: 'http://dbpedia.org/property/',
	dbr: 'http://dbpedia.org/resource/',
	rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
	xsd: 'http://www.w3.org/2001/XMLSchema#',
	sw: 'http://starwars.wikia.com/wiki/',
	gnisf: 'http://data.usgs.gov/lod/gnis/feature/',
	gnis: 'http://data.usgs.gov/lod/gnis/ontology/',
	cegis: 'http://data.usgs.gov/lod/cegis/ontology/',
	cegisf: 'http://data.usgs.gov/lod/cegis/feature/',
	'umbel-rc': 'http://umbel.org/umbel/rc/',
};

const R_SELECTOR = /^(\w*)(.*)$/;
const R_EXTRACT = /^(?:([#.])([^#.:]+)|(?:[:](.*)$))/;
function dd(...a_args) {
	let d_element;
	let z_arg = a_args.shift();
	if(!z_arg) return;
	if('string' === typeof z_arg) {
		let m_selector = R_SELECTOR.exec(z_arg);
		if(!m_selector) throw 'invalid selector syntax';

		// tag name
		d_element = document.createElement(m_selector[1] || 'div');

		// aux attributes
		let s_aux = m_selector[2];

		// id
		let m_extract = R_EXTRACT.exec(s_aux);
		while(m_extract) {
			switch(m_extract[1]) {
				// id
				case '#':
					d_element.id = m_extract[2];
					break;

				// class name
				case '.':
					d_element.className = m_extract[2];
					break;

				case undefined:
					d_element.textContent = m_extract[3];
					break;

				default:
					throw 'unrecognized selector instruction: '+s_aux;
			}

			s_aux = s_aux.substr(m_extract[0].length);
			m_extract = R_EXTRACT.exec(s_aux);
		}

		z_arg = a_args.shift();
		if(!z_arg) return d_element;
	}
	else {
		d_element = document.createElement('div');
	}

	// properties
	if(Object === z_arg.constructor) {
		Object.assign(d_element, z_arg);
		z_arg = a_args.shift();
		if(!z_arg) return d_element;
	}

	// attributes
	if(Object === z_arg.constructor) {
		for(let s_key in z_arg) {
			d_element.setAttribute(s_key, z_arg[s_key]);
		}
		z_arg = a_args.shift();
		if(!z_arg) return d_element;
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

function gobble(s_code) {
	let n_gobble = 0;
	return s_code.replace(/^(\s*\n)+/, '').split('\n').map((s_line) => {
		if(!s_line.startsWith('\t')) return s_line;
		let n_tabs = /^\t+/.exec(s_line)[0].length;
		if(!n_gobble) n_gobble = n_tabs;
		return s_line.substr(n_gobble);
	}).join('\n');
}

function load_file(ab_file) {
	graphy.dti.load(ab_file, {
		prefixes: H_PREFIXES,
		progress(i_read, s_section) {
			console.log(s_section+': '+i_read);
		},
		ready(_k_graph) {
			k_graph = _k_graph;

			k_graph.plugins.register({
				number: data_numbers(),
				language: data_languages(['en', 'fr']),
			});

			console.log('registered plugins');

			document.getElementById('query').classList.add('full');
			document.querySelector('#help .run button').addEventListener('click', () => {
				eval_query(true);
			});

			document.querySelector('#help .yield button').addEventListener('click', () => {
				eval_query(false);
			});

			setTimeout(() => {
				y_editor.resize();
			}, 1500);
		},
	});
}

function download_torrent(h_dataset) {
	let {
		torrent: sb64_torrent,
		magnet: p_magnet,
		web_seeds: a_web_seeds=[],
	} = h_dataset;

	let k_progress = new progress();
	k_progress.update({
		overview: 'Searching for peers, waiting for next announce...',
		// bar: 'Give it a minute',
	});

	//
	y_torrent_client.on('error', (e_client) => {
		console.error(e_client);
	});

	// download torrent
	let ab_torrent = buffer.Buffer.from(sb64_torrent, 'base64');
	let y_premature_torrent = y_torrent_client.add(ab_torrent, (y_torrent) => {
		let b_interval = false;

		// every time a chunk is downloaded
		y_torrent.on('download', (n_bytes) => {
			if(!b_interval) {
				b_interval = true;
				setInterval(() => {
					k_progress.update({
						overview: `Downloading dataset from ${y_torrent.numPeers} peers`,
						progress: y_torrent.progress,
						info: `${format.mebibytes(y_torrent.downloaded)} / ${format.mebibytes(y_torrent.length)}  @ ${format.mebibytes(y_torrent.downloadSpeed)}/s  -${format.milliseconds(y_torrent.timeRemaining)}`,
					});
				}, 500);
			}
		});

		// read dataset into stream
		// let ds_dataset = y_torrent.files[0].createReadStream();

		y_torrent.files[0].getBuffer((e_fetch, ab_file) => {
			if(e_fetch) {
				throw e_fetch;
			}

			load_file(ab_file);
		});
	});

	// listen to warnings and errors
	y_premature_torrent.on('warning', (e_torrent) => {
		console.warn(e_torrent);
	});
	y_premature_torrent.on('error', (e_torrent) => {
		console.error(e_torrent);
	});

	// no peers
	y_premature_torrent.on('noPeers', (s_announce_type) => {
		k_progress.update({
			overview: `No peers found in ${s_announce_type} announce. You might want to load dataset directly`,
		});
	});

	// add web seeds
	a_web_seeds.forEach((p_web_seed) => {
		if(p_web_seed.startsWith('/')) p_web_seed = location.origin+p_web_seed;
		y_premature_torrent.addWebSeed(p_web_seed);
	});
}


function terse(h_node) {
	let b_rep = false;
	for(let s_prefix in H_PREFIXES) {
		let p_uri = H_PREFIXES[s_prefix];
		if(h_node.value.startsWith(p_uri)) {
			return [
				$('<span class="prefix" />').text(s_prefix),
				$('<span class="suffix" />').text(h_node.value.substr(p_uri.length)),
			];
		}
	}

	return document.createTextNode('<'+h_node.value+'>');
}

function itemize(k_item) {
	let q_item = $('<div class="cell" />');
	// named node
	if(k_item.isNamedNode) {
		q_item.attr('data-type', 'named-node');

		let b_rep = false;
		for(let s_prefix in H_PREFIXES) {
			let p_uri = H_PREFIXES[s_prefix];
			if(k_item.value.startsWith(p_uri)) {
				q_item.append([
					$('<span class="prefix" />').text(s_prefix),
					$('<span class="suffix" />').text(k_item.value.substr(p_uri.length)),
				]);
				b_rep = true;
				break;
			}
		}
		if(!b_rep) {
			q_item.text('<'+k_item.value+'>');
		}
	}
	else if(k_item.isLiteral) {
		if(k_item.hasOwnProperty('language')) {
			q_item.attr('data-type', 'literal').append([
				$('<span class="value" />').text(k_item.value),
				$('<span class="language" />').text(k_item.language),
			]);
		}
		else if(k_item.hasOwnProperty('datatype')) {
			q_item.attr('data-type', 'literal').append([
				$('<span class="value" />').text(k_item.value),
				$('<span class="datatype" data-type="named-node" />').append(terse(k_item.datatype)),
			]);
		}
		else {
			q_item.attr('data-type', 'literal').append([
				$('<span class="value" />').text(k_item.value),
			]);
		}
	}
	else {
		q_item.attr('data-type', 'custom').append([
			$('<span class="value" />').text(k_item),
		]);
	}

	return q_item;
}

function eval_query(b_run) {
	// clear results container
	let q_results = $('#results').empty();
	let q_result_set = $('<div class="result-set" />').appendTo(q_results);
	let q_header = $('<div class="header" />').appendTo(q_result_set);
	let q_body = $('<div class="body" />').appendTo(q_result_set);

	let q_status = $('#console .status').removeClass('stable').text('querying...');

	// forward meta+enter key event to mode-editor
	let f_query = eval(y_editor.getValue());

	if(b_run) {
		// invoke and fetch rows
		let n_start = performance.now();
		let a_rows = f_query.apply(null, [k_graph]).rows();
		let n_elapsed = performance.now() - n_start;

		// results
		q_status.addClass('stable').text(`${a_rows.length} results in ${n_elapsed.toFixed(3)}ms`);

		// each field
		if(a_rows.length) {
			// prep row
			let q_row = $('<div class="fields" />').appendTo(q_header);

			// append items
			for(let s_key in a_rows[0]) {
				$('<div class="field" />').text(s_key).prependTo(q_row);
			}
		}

		// paginate results
		let n_max = Math.min(100, a_rows.length);
		for(let i_row=0; i_row<n_max; i_row++) {
			let h_row = a_rows[i_row];

			// prep row
			let q_row = $('<div class="row" />').appendTo(q_body);

			// append items
			for(let s_key in h_row) {
				itemize(h_row[s_key]).prependTo(q_row);
			}
		}
	}
	else {
		let n_start = performance.now();
		let fi_results = f_query.apply(null, [k_graph]).results();

		// use first result to construct header
		let hi_first = fi_results.next();
		let n_elapsed = performance.now() - n_start;

		let c_results = 0;

		// no results
		if(hi_first.done) {
			q_status.addClass('stable').text(`0 results in ${n_elapsed.toFixed(3)}ms`);
		}
		else {
			let h_first_row = hi_first.value;

			// header
			let q_header_row = $('<div class="fields" />').appendTo(q_header);

			// append fields
			for(let s_key in h_first_row) {
				$('<div class="field" />').text(s_key).prependTo(q_header_row);
			}

			// prep row
			let q_row = $('<div class="row" />').appendTo(q_body);

			// append items
			for(let s_key in h_first_row) {
				itemize(h_first_row[s_key]).prependTo(q_row);
			}

			// status
			q_status.addClass('stable').text(`${c_results} results in ${n_elapsed}.toFixed(3)ms`);

			c_results += 1;
		}

		let render_next = () => {
			let hi_result = fi_results.next();
			if(hi_result.done) return;

			let h_row = hi_result.value;

			n_elapsed = performance.now() - n_start;

			// prep row
			let q_row = $('<div class="row" />').appendTo(q_body);

			// append items
			for(let s_key in h_row) {
				itemize(h_row[s_key]).prependTo(q_row);
			}

			q_status.text(`${++c_results} results in ${n_elapsed.toFixed(3)}ms`);

			setTimeout(render_next, 0);
		};

		setTimeout(render_next, 0);
	}
}

const format = {
	mebibytes(n_bytes) {
		return `${(n_bytes / 1024 / 1024).toFixed(2).toLocaleString()} MiB`;
	},

	milliseconds(n_ms) {
		return `${(n_ms / 1000).toFixed(2).toLocaleString()}s`;
	},

	percent(n_0_1, n_digits=0) {
		return `${(n_0_1 * 100).toFixed(n_digits)}%`;
	},

	count(n_qty) {
		return n_qty.toLocaleString();
	},
};


//
let y_torrent_client = new webtorrent();
let y_editor;
let k_graph;


// dom ready
document.addEventListener('DOMContentLoaded', () => {

	// 
	let d_graph_selection = document.getElementById('graph-selection');

	// 
	let d_list = d_graph_selection.querySelector('.prescribed .list');

	// initialize editor
	{
		// load editor
		y_editor = ace.edit('editor');

		// set mode
		y_editor.getSession().setMode('ace/mode/javascript');

		// set theme
		y_editor.setTheme('ace/theme/monokai');

		// set options
		y_editor.$blockScrolling = Infinity;
	}

	// download datasets
	request.get(`${location.origin}/datasets`, (e_req, d_xhr, s_body) => {
		if(e_req) throw e_req;

		let a_datasets;
		try {
			a_datasets = JSON.parse(s_body);
		}
		catch(e_parse) {
			throw 'could not parse json response about datasets: '+e_parse;
		}

		// load dataset
		if(location.hash) {
			let s_dataset_find = location.hash.substr(1);
			let b_loaded = a_datasets.some((h_dataset) => {
				if(s_dataset_find === h_dataset.fallback) {

					// change controls
					document.getElementById('controls').classList.remove('select');

					// download torrent from dataset descriptor
					download_torrent(h_dataset);

					// 
					setup_fallback(h_dataset);

					// set up query code
					y_editor.setValue(gobble(h_dataset.sample_query || ''));

					return true;
				}
			});

			if(b_loaded) return;
		}

		// each dataset
		a_datasets.forEach((h_dataset) => {
			// make dataset row
			let d_dataset = dd({}, {
				'data-magnet': h_dataset.magnet,
			}, [
				dd('.title:'+h_dataset.name),
				dd('.info', [
					dd(`span.size:${format.mebibytes(h_dataset.size)}`),
					dd(`span.triples:${format.count(h_dataset.triples)} triples`),
				]),
				dd('.description:'+h_dataset.description.replace(/\t/g, '    ')),
			]);

			// bind click event
			d_dataset.addEventListener('click', function() {
				// change controls
				document.getElementById('controls').classList.remove('select');

				// download torrent from dataset descriptor
				download_torrent(h_dataset);

				// 
				setup_fallback(h_dataset);

				// set up query code
				y_editor.setValue(gobble(h_dataset.sample_query || ''));
			});

			// append dataset row to list
			d_list.appendChild(d_dataset);
		});

		// bind to editor event
		y_editor.container.addEventListener('keydown', (d_event) => {
			// enter key w/ cmd
			if(13 === d_event.which) {
				let b_cmd_key = d_event.metaKey || d_event.ctrlKey;
				let b_shift_key = d_event.shiftKey;

				if(b_cmd_key || b_shift_key) {
					eval_query(b_cmd_key);
				}
			}
		// });
			// // enter key w/ cmd
			// if(13 === d_event.which) {
			// 	let b_cmd_key = d_event.metaKey || d_event.ctrlKey;
			// 	let b_shift_key = d_event.shiftKey;

			// 	if(b_cmd_key || b_shift_key) {
			// 		// clear previous result set
			// 		d_results.childNodes[0].remove();

			// 		// result set components
			// 		let d_header = dd({className:'header'});
			// 		let d_body = dd({className:'body'});

			// 		// new result set
			// 		let d_result_set = dd([d_header, d_body]);
			// 		d_results.appendChild(d_result_set);

			// 		d_query_status.classList.remove('stable');
			// 		d_query_status.textContent = 'querying...';

			// 		// forward meta+enter key event to mode-editor
			// 		let f_query = eval(y_editor.getValue());

			// 		if(b_cmd_key) {
			// 			// invoke and fetch rows
			// 			let n_start = performance.now();
			// 			let a_rows = f_query.apply(null, [k_graph]).rows();
			// 			let n_elapsed = performance.now() - n_start;

			// 			// results
			// 			d_status.classList.add('stable');
			// 			d_status.textContent = `${a_rows.length} results in ${n_elapsed.toFixed(3)}ms`;

			// 			// each field
			// 			if(a_rows.length) {
			// 				// prep row
			// 				let d_row = dd({className:'fields'});
			// 				d_header.appendChild(d_row);

			// 				// append items
			// 				for(let s_key in a_rows[0]) {
			// 					d_row.appendChild(dd({className:'field', textContent: s_key}));
			// 					$('<div class="field" />').text(s_key).prependTo(q_row);
			// 				}
			// 			}

			// 			// paginate results
			// 			let n_max = Math.min(100, a_rows.length);
			// 			for(let i_row=0; i_row<n_max; i_row++) {
			// 				let h_row = a_rows[i_row];

			// 				// prep row
			// 				let q_row = $('<div class="row" />').appendTo(q_body);

			// 				// append items
			// 				for(let s_key in h_row) {
			// 					itemize(h_row[s_key]).prependTo(q_row);
			// 				}
			// 			}
			// 		}
			// 		else {
			// 			let n_start = performance.now();
			// 			let fi_results = f_query.apply(null, [k_graph]).results();
			// 			let n_elapsed = performance.now() - n_start;

			// 			// use first result to construct header
			// 			let hi_first = fi_results.next();

			// 			let c_results = 0;

			// 			// no results
			// 			if(hi_first.done) {
			// 				q_status.addClass('stable').text(`0 results in ${n_elapsed}.toFixed(3)ms`);
			// 			}
			// 			else {
			// 				let h_first_row = hi_first.value;

			// 				// header
			// 				let q_header_row = $('<div class="fields" />').appendTo(q_header);

			// 				// append fields
			// 				for(let s_key in h_first_row) {
			// 					$('<div class="field" />').text(s_key).prependTo(q_header_row);
			// 				}

			// 				// prep row
			// 				let q_row = $('<div class="row" />').appendTo(q_body);

			// 				// append items
			// 				for(let s_key in h_first_row) {
			// 					itemize(h_first_row[s_key]).prependTo(q_row);
			// 				}

			// 				// status
			// 				q_status.addClass('stable').text(`${c_results} results in ${n_elapsed}.toFixed(3)ms`);

			// 				c_results += 1;
			// 			}

			// 			let render_next = () => {
			// 				let hi_result = fi_results.next();
			// 				if(hi_result.done) return;

			// 				let h_row = hi_result.value;

			// 				n_elapsed = performance.now() - n_start;

			// 				// prep row
			// 				let q_row = $('<div class="row" />').appendTo(q_body);

			// 				// append items
			// 				for(let s_key in h_row) {
			// 					itemize(h_row[s_key]).prependTo(q_row);
			// 				}

			// 				q_status.text(`${++c_results} results in ${n_elapsed.toFixed(3)}ms`);

			// 				setTimeout(render_next, 0);
			// 			};

			// 			setTimeout(render_next, 0);
			// 		}
			// 	}
			// }
		});
	});

});
