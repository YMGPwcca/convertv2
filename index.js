const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files'); //Useless for now
const getCmd = require('./lib/getCmd');

//Clear terminal/command promt interface and print Convertv2
clear();
console.log(chalk.yellow(figlet.textSync('Convertv2', { horizontalLayout: 'full' })));

//Get language data (default is Vietnamese)
var langFile = (fs.readFileSync(`v1/app/handle/src/langs/vi.lang`, { encoding: 'utf-8' })).split(/\r?\n/)
var langData = langFile.filter(item => item.indexOf('#') != 0 && item != '')

//Do the thing
(async () => {
  const credentials = await getCmd.askCmdInfo();
  console.log(credentials);
})();