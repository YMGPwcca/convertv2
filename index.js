const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs-extra');
const beauty = require('js-beautify').js;
const getCmd = require('./lib/cmd');
const getText = require('./lib/text');
const makeInfo = require('./lib/info');
const getContent = require('./lib/content');

//Clear terminal/command promt interface and print Convertv2
clear();
console.log(chalk.yellow(figlet.textSync('Convertv2', { horizontalLayout: 'full' })));
console.log(chalk.magenta(`> Version: ${JSON.parse(fs.readFileSync('package.json')).version}`));
console.log(chalk.cyan('> By SpermLord'));

//Create dist folder
fs.ensureDirSync('dist');

//message.js
var message = fs.readFileSync('lib/message.js', { encoding: 'utf-8' });

//Do the thing
let init = async () => {
	//Wait for CLI
	const credentials = await getCmd.askCmdInfo(message);
	let { name, version, perm, credit, cooldown, dependencies } = credentials;

	//Get cmd info
	let config = makeInfo(name, version, perm, credit, cooldown, dependencies);

	//Get if/else content
	let content = getContent(message, name);

	//Reverse getText function
	let reverse = content.match(/api.sendMessage\(getText(.*?)ID\)/g);
	if (reverse) {
		for (let i of reverse) {
			let original = i;
			i = i.replace(/api\.sendMessage\(/g, '').replace(/, event\.threadID, event\.messageID\)/g, '').replace(/getText\(/g, '');
			i = i.slice(0, -1);
			let send = (text) => `api.sendMessage(\`${text}\`, event.threadID, event.messageID)`;
			content = content.replace(original, send(getText(i)));
		}
	}

	//Write to new file
	let fullCode = beauty(config + '\n\n' + content, { indent_size: 2, space_in_empty_paren: true })
	fs.writeFileSync(`dist/${name}.js`, fullCode);
	console.log(`${chalk.green.bold('>>>')} ${chalk.green.underline.bold(`Đã ghi vào dist/${name}.js.`)} ${chalk.green.bold('<<<')}`)
	return console.log(`${chalk.red.bold('>>>')} ${chalk.red.bold(`Bạn sẽ cần phải check lại file 1 lần nữa`)} ${chalk.red.bold('<<<')}`);;
};
init();