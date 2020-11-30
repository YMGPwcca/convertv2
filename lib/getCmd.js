const inquirer = require('inquirer');

module.exports.askCmdInfo = () => {
	const questions = [
		{
			name: 'name',
			type: 'input',
			message: 'Enter the command that need to be ported:',
			validate: function(value) {
				if (value.length) return true;
				else return 'Please enter the command that need to be ported.';
			}
		},
		{
			name: 'version',
			type: 'input',
			message: 'Enter the command version:',
			validate: function(value) {
				if (value.length) return true;
				else return 'Please enter the version.';
			}
		},
		{
			name: 'perm',
			type: 'input',
			message: 'Enter the command permission (0/1/2):',
			validate: function(value) {
				if (value == 0 || value == 1 || value == 2) return true;
				else return 'Please enter the permission.';
			}
		},
		{
			name: 'credit',
			type: 'input',
			message: 'Enter the command author:',
			validate: function(value) {
				if (value.length) return true;
				else return 'Please enter a name.';
			}
		},
		{
			name: 'cooldown',
			type: 'input',
			message: 'Enter the command cooldown (s):',
			validate: function(value) {
				if (value.length) return true;
				else return 'Please enter the cooldown.';
			}
		},
		{
			name: 'dependencies',
			type: 'input',
			message: 'Enter the command dependencies:',
			validate: function(value) {
				if (value.length) return true;
				else return 'Please enter the dependencies.';
			}
		}
	];
	return inquirer.prompt(questions);
}