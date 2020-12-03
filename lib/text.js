const getLang = require('./lang');

module.exports = function(args) {
	args = args.split(', ');
	const langText = { ...getLang.message, ...getLang.fishing, ...getLang.thread, ...getLang.user };
	const getKey = args[0].replace(/\'/g, '');
	if (!langText.hasOwnProperty(getKey)) throw `${__filename} - Not found key language: ${getKey}`;
	let text = langText[getKey].replace(/\n/g, '\\n');
	for (let i = args.length; i > 0; i--) {
		let regEx = RegExp(`%${i}`, 'g');
		text = text.replace(regEx, `\$\{${args[i]}\}`);
	}
	return text;
}