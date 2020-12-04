const fs = require('fs-extra');
const helpInfo = require('./listCommands.json');

module.exports = function (name, ver, perm, credit, cooldown, dependencies) {
	let cmdInfo = helpInfo.filter(item => item.name == name)[0];
	let { desc, usage, group } = cmdInfo;
	if (dependencies.length > 0 && dependencies[0] != '') dependencies = JSON.stringify(dependencies);
	else dependencies = '[]';
	let config = `module.exports.config = {name: "${name}",version: "${ver}",hasPermssion: ${perm},credits: "${credit}",description: "${desc}",commandCategory: "${group}",usages: "${usage}",cooldowns: ${cooldown},dependencies: ${dependencies}};`
	return config;
}