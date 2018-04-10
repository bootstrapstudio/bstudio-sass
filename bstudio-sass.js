#!/usr/bin/env node

let sass = require('node-sass');
let path = require('path');
let readline = require('readline');

if (process.stdin.isTTY) {
	
	console.log('bstudio-sass is Bootstrap Studio\'s sidekick for compiling SASS files.');
	console.log('To link this utility to Bootstrap Studio, please use the following path:');

	var cmd = process.argv[1];

	if (process.platform == 'win32') {
		cmd = cmd.replace('\\node_modules\\bstudio-sass\\bstudio-sass.js', '\\bstudio-sass');
	}

	console.log(cmd);

	process.exit();
}

let supportedVersions = {
	inputMessage: 1,
	outputMessage: 1
};

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

process.chdir('/');

rl.on('line', function(data){
	
	let message = {};
	
	try {

		message = JSON.parse(data);

		if (!message.version || message.version > supportedVersions.inputMessage) {
			throw new Error('This message format is not supported. Please update bstudio-sass.');
		}

		if (!message.files || typeof message.files != 'object') {
			throw new Error('Missing or invalid file entry.');
		}

		// Compile all regular sass files

		let result = {};

		for (let filePath in message.files) {

			if (/^_/.test(path.basename(filePath))) {
				// SASS partial. Skip compilation.
				continue;
			}

			let render = sass.renderSync({
				file: filePath,
				data: message.files[filePath] || ' ',
				outputStyle: 'expanded',
				importer: function(url, prev) {

					if (/^https?:\/\//.test(url)) {
						// Leave URLs as is
						return null;
					}

					// Compensating for libsass' insistence on prepending
					// paths with the current working directory. Also,
					// normalizing Windows path separators.

					let resolvedPath = path.resolve(path.dirname(prev), url).replace(process.cwd(), '/').replace(/\\/g, '/');

					if (path.extname(resolvedPath) != 'scss') {
						resolvedPath += '.scss';
					}

					let underScorePath = path.dirname(resolvedPath) + '/_' + path.basename(resolvedPath);
					underScorePath = underScorePath.replace(/\/+/g, '/');

					if (underScorePath in message.files) {
						resolvedPath = underScorePath;
					}

					if (!resolvedPath in message.files) {
						return new Error('File to import not found or unreadable: ' + url + 
							'\nParent style sheet: ' + prev);
					}

					return {
						file: resolvedPath,
						contents: message.files[resolvedPath]
					};
				}
			});

			result[filePath] = render.css.toString();
		}

		output({
			version: supportedVersions.outputMessage,
			jobID: message.jobID,
			result: result
		});

	}
	catch (e){

		if (e.formatted) {
			errorAndExit(
				'SASS Compilation Error', 
				e.message,
				message.jobID,
				{
					formatted: e.formatted,
					file: e.file ? 
						e.file.replace(process.cwd(), '/').replace(/\\/g, '/'):
						null,
					line: e.line,
					column: e.column
				}
			);
		}

		errorAndExit('Invalid message format', e.message, message.jobID);
	}

});

function output(message) {
	console.log(JSON.stringify(message));
}

function errorAndExit(short, long, jobID, data = {}) {
	outputAndExit({
		status: 'error',
		short: short, 
		long: long || '',
		jobID: jobID,
		data: data
	});
}

function outputAndExit(message) {
	console.log(JSON.stringify(message));
    process.exit();
}
