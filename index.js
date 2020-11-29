const fs = require('fs-extra')
var args = process.argv.slice(2)
if (args.length != 1) return console.error('Only accept 1 argument.')
if (args[0] == '--force') isForce = true

//Get language data (default is Vietnamese)
var langFile = (fs.readFileSync(`./app/handle/src/langs/vi.lang`, { encoding: 'utf-8' })).split(/\r?\n/)
var langData = langFile.filter(item => item.indexOf('#') != 0 && item != '')

if (!fs.existsSync('app')) console.error('This file need to be placed in v1 folder.')

var message.js = fs.readFileSync(`./app/handle/message.js`, { encoding: 'utf-8' })
