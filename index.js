const fs = require('fs-extra')
var args = process.argv.slice(2)
if (args.length == 0) return console.error('Enter a command that need to be ported.')
if (args.length != 1) return console.error('Only accept 1 argument.')
if (!fs.existsSync('v1/app')) return console.error('This file need to be placed in v1 folder.')

//Get language data (default is Vietnamese)
var langFile = (fs.readFileSync(`v1/app/handle/src/langs/vi.lang`, { encoding: 'utf-8' })).split(/\r?\n/)
var langData = langFile.filter(item => item.indexOf('#') != 0 && item != '')

var message = fs.readFileSync(`v1/app/handle/message.js`, { encoding: 'utf-8' })
if (message.includes(`if (contentMessage.indexOf(\`\$\{prefix\}${args[0]}\`) == 0)`)) {
	let index = message.indexOf(`if (contentMessage.indexOf(\`\$\{prefix\}${args[0]}\`) == 0)`)
	message = message.slice(index, message.length)
	let getComment = message.indexOf('//')
	message = message.slice(0, getComment)
	console.log(message)
}
else console.error('No')