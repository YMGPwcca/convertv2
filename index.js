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
console.log(chalk.magenta(`> Version: ${JSON.parse(fs.readFileSync('package.json')).version}`));
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
dependencies: ${dependencies}
};`

//Do the thing
let init = async () => {
	var hasCB = 0;

	//Wait for CLI
	const credentials = await getCmd.askCmdInfo(message);
	let { name, version, perm, credit, cooldown, dependencies } = credentials;

	//Get if/else content
	let checkIf = message.indexOf(`if (contentMessage.indexOf(\`\$\{prefix\}${name}\`) == 0`) || message.indexOf(`if (contentMessage == \`\$\{prefix\}${name}\``);
	message = message.slice(checkIf, message.length);
	let getComment = message.search(/[^\:]\/\/.*/);
	message = message.slice(0, getComment);
	let start = message.search(/if \(.*\) \{/) + 3 || message.search(/if \(.*\)\{/) + 2 || message.indexOf('return');
	message = message.replace(/senderID/g, 'event.senderID').replace(/, threadID/g, ', event.threadID').replace(/, messageID/g, ', event.messageID').replace(/\t/g,'').replace(/content \= contentMessage.slice\(prefix.length \+ \d, contentMessage.length\)/, 'content \= args.join(" ")').replace(/contentMessage\.length/g, 'content.length');
	let splitMessage = message.split(/\r?\n/);
	if (splitMessage[0].includes(') {') || splitMessage[0].includes('){')) hasCB = 1;
	splitMessage.splice(0, 1);
	splitMessage = splitMessage.filter(i => i != '');
	if (hasCB == 1) splitMessage = splitMessage.slice(0, -1);
	message = splitMessage.join('\n');

	//Get cmd info
	let cmdInfo = helpInfo.filter(item => item.name == name)[0];
	let { desc, usage, group } = cmdInfo;
	let splitDependencies = dependencies.split(', ');
	if (splitDependencies.length > 0 && splitDependencies[0] != '') dependencies = JSON.stringify(splitDependencies);
	else dependencies = '[]';

	//Reverse getText function
	let a = message.match(/api.sendMessage\(getText(.*?)ID\)/g);
	if (a) {
		for (let i of a) {
			let o = i;
			i = i.replace(/api\.sendMessage\(/g, '').replace(/, event\.threadID, event\.messageID\)/g, '').replace(/getText\(/g, '');
			i = i.slice(0, -1);
			let send = (text) => `api.sendMessage(\`${text}\`, event.threadID, event.messageID)`;
			message = message.replace(o, send(getText(i)));
		}
	}

	//Write to new file
	let fullCode = beauty(config(name, version, perm, credit, desc, group, usage, cooldown, dependencies) + '\n\n' + run(message), { indent_size: 2, space_in_empty_paren: true })
	fs.writeFileSync(`dist/${name}.js`, fullCode);
	console.log(`${chalk.green.bold('>>>')} ${chalk.green.underline.bold(`Đã ghi vào dist/${name}.js.`)} ${chalk.green.bold('<<<')}`)
	return console.log(`${chalk.red.bold('>>>')} ${chalk.red.bold(`Bạn sẽ cần phải check lại file 1 lần nữa`)} ${chalk.red.bold('<<<')}`);;
};
init();