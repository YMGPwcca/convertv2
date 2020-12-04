module.exports = function (message, name) {
	var hasOCB = 0;
	let checkIf = message.includes(`if (contentMessage.indexOf(\`\$\{prefix\}${name}\`) == 0`) ? message.indexOf(`if (contentMessage.indexOf(\`\$\{prefix\}${name}\`) == 0`) : message.indexOf(`if (contentMessage == \`\$\{prefix\}${name}\``);
	message = message.slice(checkIf, message.length);
	let getComment = message.search(/[^\:]\/\/.*/);
	message = message.slice(0, getComment);
	message = message.replace(/senderID/g, 'event.senderID').replace(/, threadID/g, ', event.threadID').replace(/, messageID/g, ', event.messageID').replace(/\t/g, '').replace(/content \= contentMessage.slice\(prefix.length \+ \d, contentMessage.length\)/, 'content \= args.join(" ")').replace(/contentMessage\.length/g, 'content.length');
	let splitMessage = message.split(/\r?\n/);
	if (splitMessage[0].includes(') {') || splitMessage[0].includes('){')) hasOCB = 1;
	splitMessage.splice(0, 1);
	splitMessage = splitMessage.filter(i => i != '');
	if (hasOCB == 1) splitMessage = splitMessage.slice(0, -1);
	message = splitMessage.join('\n');
	let run = `module.exports.run = function({ api, event, args, client, __GLOBAL }) {${message}}`;
	return run;
}