const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs-extra');
const beauty = require('js-beautify').js;
const getCmd = require('./lib/cmd');
const getText = require('./lib/text');

//Clear terminal/command promt interface and print Convertv2
clear();
console.log(chalk.yellow(figlet.textSync('Convertv2', { horizontalLayout: 'full' })));
console.log(chalk.cyan('> By SpermLord'));

//Create dist folder
fs.ensureDirSync('dist');

//message.js
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
	const credentials = await getCmd.askCmdInfo(message);
	let { name, version, perm, credit, cooldown, dependencies } = credentials;
	let index = message.indexOf(`if (contentMessage.indexOf(\`\$\{prefix\}${name}\`) == 0)`);
	message = message.slice(index, message.length);
	let getComment = message.indexOf('//');
	message = message.slice(0, getComment);
	let start = message.indexOf(') {') + 3 || message.indexOf('){') + 2;
	let end = message.lastIndexOf('}');
	message = message.slice(start, end);
	message = message.replace(/senderID/g, 'event.senderID').replace(/, threadID/g, ', event.threadID').replace(/, messageID/g, ', event.messageID').replace(/\t/g,'').replace(/contentMessage.slice\(prefix.length \+ \d, contentMessage.length\)/, 'args.join(" ")');

	//Get cmd info
	let cmdInfo = helpInfo.filter(item => item.name == name)[0];
	let { desc, usage, group } = cmdInfo;
	let splitDependencies = dependencies.split(', ');
	if (splitDependencies.length > 0 && splitDependencies[0] != '') dependencies = JSON.stringify(splitDependencies);
	else dependencies = '[]';

	//Reverse getText function
	let a = message.match(/api.sendMessage\((.*?)ID\)/g);
	for (let i of a) {
		let o = i;
		i = i.replace(/api\.sendMessage\(/g, '').replace(/, event\.threadID, event\.messageID\)/g, '').replace(/getText\(/g, '');
		i = i.slice(0, -1);
		let send = (text) => `api.sendMessage(\`${text}\`, event.threadID, event.messageID)`;
		message = message.replace(o, send(getText(i)));
	}

	//Write to new file
	let fullCode = beauty(config(name, version, perm, credit, desc, group, usage, cooldown, dependencies) + '\n\n' + run(message), { indent_size: 2, space_in_empty_paren: true })
	fs.writeFileSync(`dist/${name}.js`, fullCode);
	return console.log(`${chalk.green.bold('>>>')} ${chalk.green.underline.bold(`Wrote to dist/${name}.js.`)} ${chalk.green.bold('<<<')}`);
};
init();