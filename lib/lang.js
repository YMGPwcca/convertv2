const fs = require('fs-extra');
var language = new Object({
	index: new Object(),
	listen: new Object(),
	event: new Object(),
	message: new Object(),
	reply: new Object(),
	unsend: new Object(),
	reaction: new Object(),
	login: new Object(),
	update: new Object(),
	fishing: new Object(),
	thread: new Object(),
	user: new Object(),
	nsfw: new Object(),
	custom: new Object()
});

//Get language data (default is Vietnamese)
var langFile = (fs.readFileSync(`v1/app/handle/src/langs/vi.lang`, { encoding: 'utf-8' })).split(/\r?\n/);
var langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (let item of langData) {
	let getSeparator = item.indexOf('=');
	let itemKey = item.slice(0, getSeparator);
	let itemValue = item.slice(getSeparator + 1, item.length);
	let head = itemKey.slice(0, itemKey.indexOf('.'));
	let key = itemKey.replace(head + '.', '');
	let value = itemValue.replace(/\\n/gi, '\n');
	language[head][key] = value;
}

module.exports = language;