const inquirer = require('inquirer');

module.exports.askCmdInfo = (message) => {
	const questions = [
		{
			name: 'name',
			type: 'input',
			message: 'Hãy điền tên lệnh cần chuyển:',
			validate: function(value) {
				if (value.length) {
					if (message.includes(`if (contentMessage.indexOf(\`\$\{prefix\}${value}\`) == 0`) || message.includes(`if (contentMessage == \`\$\{prefix\}${value}\``)) return true;
					else return 'Không có lệnh nào có tên như này.'
				}
				else return 'Hãy nhập tên lệnh cần chuyển.';
			}
		},
		{
			name: 'version',
			type: 'input',
			message: 'Phiên bản (Eg. 1.0.0):',
			validate: function(value) {
				if (value.length) {
					let checkValid = value.split('.');
					if (checkValid.length == 3) {
						let number = 0
						for (let i of checkValid) {
							if (!isNaN(i) && i != '') number += 1;
							else return 'Phải là 1 số phiên bản.'
						}
						if (number == 3) return true;
					}
					else return 'Sai định dạng.'
				}
				else return 'Hãy nhập phiên bản.';
			}
		},
		{
			name: 'perm',
			type: 'input',
			message: 'Quyền dùng lệnh (0/1/2):',
			validate: function(value) {
				if (value.length && (value == 0 || value == 1 || value == 2)) return true;
				else return 'Hãy nhập quyền dùng lệnh.\n0: Người dùng.\n1: Admin nhóm trở lên.\n2: Chủ/Admin bot.';
			}
		},
		{
			name: 'credit',
			type: 'input',
			message: 'Tác giả:',
			validate: function(value) {
				if (value.length) return true;
				else return 'Hãy điền tên tác giả của lệnh này.';
			}
		},
		{
			name: 'cooldown',
			type: 'input',
			message: 'Thời gian chờ trước khi dùng lại (s):',
			validate: function(value) {
				if (value.length) return true;
				else return 'Vui lòng nhập thời gian chờ.';
			}
		},
		{
			name: 'dependencies',
			type: 'input',
			message: 'Module ngoài (Bỏ trống hoặc VD: axios, fs-extra, ...):',
			validate: function(value) {
				return true;
			}
		}
	];
	return inquirer.prompt(questions);
}