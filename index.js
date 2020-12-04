const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs-extra');
const beauty = require('js-beautify').js;

//Clear terminal/command promt interface
clear();

//Check all required files
if (!fs.existsSync('lib/message.js') || !fs.existsSync('lib/listCommands.json') || !fs.existsSync('lib/vi.lang')) return console.log(`${chalk.red('[!]')} ${chalk.redBright.underline('Hãy đọc kĩ file README.md để biết cách sử dụng')} ${chalk.red('[!]')}`);

//Print Convertv2 & Version & Author
console.log(chalk.yellow(figlet.textSync('Convertv2', { horizontalLayout: 'full' })));
console.log(chalk.magenta(`> Version: ${JSON.parse(fs.readFileSync('package.json')).version}`));
console.log(chalk.cyan('> By SpermLord'));

//Require functions
const getCmd = require('./lib/cmd');
const getText = require('./lib/text');
const makeInfo = require('./lib/info');
const getContent = require('./lib/content');

//Create dist folder
fs.ensureDirSync('dist');

//message.js
var message = fs.readFileSync('lib/message.js', { encoding: 'utf-8' });

//Do the thing
async function init() {
	//Wait for CLI Input
	const cmdInfo = await getCmd(message);
	let { name, version, perm, credit, cooldown, dependencies } = cmdInfo;

	//Require all modules wrote in dependencies
	let require = '';
	if (dependencies.length > 0) {
		dependencies = dependencies.split(', ');
		for (let a of dependencies) require += `const ${a} = require('${a}');\n`;
	}
	else if (dependencies != '') require += `const ${dependencies} = require('${dependencies}');\n`;

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
	let fullCode = beauty(`${require}\n${config}\n\n${content}`, { indent_size: 2, space_in_empty_paren: true });
	fs.writeFileSync(`dist/${name}.js`, fullCode);
	console.log(`${chalk.green.bold('>>>')} ${chalk.green.underline.bold(`Đã ghi vào dist/${name}.js.`)} ${chalk.green.bold('<<<')}`);
	return console.log(`${chalk.red.bold('>>>')} ${chalk.red.bold(`Hãy check lại file để đảm bảo không có lỗi trong quá trình sử dụng`)} ${chalk.red.bold('<<<')}`);;
}
init();