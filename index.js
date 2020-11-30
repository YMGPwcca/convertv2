const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs-extra');
const beauty = require('js-beautify').js;
const files = require('./lib/files'); //Useless for now
const getCmd = require('./lib/getCmd');

//Clear terminal/command promt interface and print Convertv2
clear();
console.log(chalk.yellow(figlet.textSync('Convertv2', { horizontalLayout: 'full' })));
console.log(chalk.cyan('> By SpermLord'));

//Get language data (default is Vietnamese)
var langFile = (fs.readFileSync(`v1/app/handle/src/langs/vi.lang`, { encoding: 'utf-8' })).split(/\r?\n/);
var langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
var message = fs.readFileSync('v1/app/handle/message.js', { encoding: 'utf-8' });
var helpInfo = JSON.parse(fs.readFileSync('v1/app/handle/src/help/listCommands.json'));

//Run holder
var run = (code) => `module.exports.run = function({ api, event, args, client, __GLOBAL }) {
${code}
}`;

//Config holder
var config = (name, ver, perm, credit, desc, group, usage, cooldown, dependencies, info) => `module.exports.config = {
name: "${name}",
version: "${ver}",
hasPermssion: ${perm},
credits: "${credit}",
description: "${desc}",
commandCategory: "${group}",
usages: "${usage}",
cooldowns: ${cooldown},
dependencies: ${dependencies},
info: ${info}
};`

//Do the thing
let init = async () => {
  const credentials = await getCmd.askCmdInfo();
  let { name, version, perm, credit, cooldown, dependencies } = credentials;
  if (message.includes(`if (contentMessage.indexOf(\`\$\{prefix\}${name}\`) == 0)`)) {
		let index = message.indexOf(`if (contentMessage.indexOf(\`\$\{prefix\}${name}\`) == 0)`);
		message = message.slice(index, message.length);
		let getComment = message.indexOf('//');
		message = message.slice(0, getComment);
		let start = message.indexOf(') {') + 3 || message.indexOf('){') + 2;
		let end = message.lastIndexOf('}');
		message = message.slice(start, end);
		message = message.replace(/senderID/g, 'event.senderID');
		message = message.replace(/, threadID/g, ', event.threadID');
		message = message.replace(/, messageID/g, ', event.messageID');
		message = message.replace(/\t/g,'');
		message = message.replace(/contentMessage.slice\(prefix.length \+ \d, contentMessage.length\)/, 'args.join(" ")');

		let cmdInfo = helpInfo.filter(item => item.name == name)[0];
		let { desc, usage, group } = cmdInfo;
		let info = '[]';
		let splitDependencies = dependencies.split(', ');
		if (splitDependencies.length > 0 && splitDependencies[0] != '') dependencies = JSON.stringify(splitDependencies);
		else dependencies = '[]';
		let fullCode = beauty(config(name, version, perm, credit, desc, group, usage, cooldown, dependencies, info) + '\n\n' + run(message), { indent_size: 2, space_in_empty_paren: true })
		fs.writeFileSync('ahihi.js', fullCode);
	}
};
init();