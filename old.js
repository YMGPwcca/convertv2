const fs = require('fs-extra')
var args = process.argv.slice(2)
if (args.length == 0) return console.error('Enter a command that need to be ported.')
if (args.length != 1) return console.error('Only accept 1 argument.')
if (!fs.existsSync('v1/app')) return console.error('This file need to be placed in v1 folder.')

//Get language data (default is Vietnamese)
var langFile = (fs.readFileSync(`v1/app/handle/src/langs/vi.lang`, { encoding: 'utf-8' })).split(/\r?\n/)
var langData = langFile.filter(item => item.indexOf('#') != 0 && item != '')

fs.ensureDirSync('dist')
var config = (name, ver, perm, credit, desc, group, usage, cooldown, dependencies, arg1, type1, example1, arg2, type2, example2) => `module.exports.config = {
	name: "${name}",
	version: "${ver}",
	hasPermssion: ${perm},
	credits: "${credit}",
	description: "${desc}",
	commandCategory: "${group}",
	usages: "${usage}",
	cooldowns: ${cooldown},
	dependencies: ${dependencies}
	info: [
		{
			key: '${arg1}',
			prompt: '',
			type: '${type1}',
			example: '${example1}'
		},
		{
			key: '${arg2}',
			prompt: '',
			type: '${type2}',
			example: '${example2}'
		}
	]
};`

var run = (code) => `module.exports.run = function({ api, event, args, client, __GLOBAL }) {
${code}
}`

var message = fs.readFileSync(`v1/app/handle/message.js`, { encoding: 'utf-8' })
if (message.includes(`if (contentMessage.indexOf(\`\$\{prefix\}${args[0]}\`) == 0)`)) {
	let index = message.indexOf(`if (contentMessage.indexOf(\`\$\{prefix\}${args[0]}\`) == 0)`)
	message = message.slice(index, message.length)
	let getComment = message.indexOf('//')
	message = message.slice(0, getComment)
	let start = message.indexOf(') {') + 3 || message.indexOf('){') + 2
	let end = message.lastIndexOf('}')
	message = message.slice(start, end)
	message = message.replace(/, threadID/g, ', event.threadID')
	message = message.replace(/, messageID/g, ', event.messageID')
	message = message.replace(/\s/, '')
}
else console.error('No')