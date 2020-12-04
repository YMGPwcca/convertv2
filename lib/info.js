const fs = require('fs-extra');
const helpInfo = JSON.parse(fs.readFileSync('./lib/listCommands.json'));

module.exports = function(name, ver, perm, credit, cooldown, dependencies) {
	let cmdInfo = helpInfo.filter(item => item.name == name)[0];
	let { desc, usage, group } = cmdInfo;
	let splitDependencies = dependencies.split(', ');
	if (splitDependencies.length > 0 && splitDependencies[0] != '') dependencies = JSON.stringify(splitDependencies);
	else dependencies = '[]';
	let config = `module.exports.config = {name: "${name}",version: "${ver}",hasPermssion: ${perm},credits: "${credit}",description: "${desc}",commandCategory: "${group}",usages: "${usage}",cooldowns: ${cooldown},dependencies: ${dependencies}};`
	return config;
}