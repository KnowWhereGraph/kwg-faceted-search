const io = require('socket.io-client');
const ss = require('socket.io-stream');
const buffer = require('buffer');

module.exports = function(self) {
	self.addEventListener('message', (d_msg) => {
		// open socket
		let k_socket = io.connect(location.origin);

		// create socket stream
		let ds_input = ss.createStream();

		// dataset event
		k_socket.on('dataset', (h_dataset) => {
			self.postMessage({
				event: 'metadata',
				metadata: h_dataset,
			});
		});

		// once socket is open
		k_socket.on('connect', () => {

			// collect readable chunks
			let a_chunks = [];
			let n_size = 0;
			ds_input.on('data', (z_chunk) => {
				// add chunk to list
				a_chunks.push(z_chunk);
				n_size += z_chunk.byteLength;

				// update main thread
				self.postMessage({
					event: 'progress',
					progress: n_size,
				});
			});

			// input stream end, create final buffer
			ds_input.on('end', () => {
				let ab_buffer = buffer.Buffer.concat(a_chunks, n_size);

				// transfer object to main thread
				self.postMessage({
					event: 'dataset',
					buffer: ab_buffer.buffer,
				}, [ab_buffer.buffer]);
			});

			// error!
			ds_input.on('error', () => {
				debugger;
			});

			// request download
			ss(k_socket).emit('download', d_msg.data.download, ds_input);
		});
	});
};
