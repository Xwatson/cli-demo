#!/usr/bin/env node
const program = require('commander')

program.version('1.0.0')
	.usage('init [your project name]')
	.command('init', 'init project')
	.parse(process.argv)