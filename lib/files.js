const fs = require('fs');
const path = require('path');

module.exports.getCDB = () => {
	return path.basename(process.cwd());
}
module.exports.directoryExists = (path) => {
	return fs.existsSync(path);
}