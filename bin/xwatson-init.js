#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const program = require('commander')
const glob = require('glob')
const inquirer = require('inquirer') // 命令行交互
const chalk = require('chalk') // 颜色终端
const logSymbols = require('log-symbols') // 图标
const download = require('../lib/download') // 下载模板
const generator = require('../lib/generator')

program.usage('<project-name>').parse(process.argv)

// 获取项目名称
let projectName = program.args[0]

if (!projectName) {  // 项目名称必填
    console.log(logSymbols.error, chalk.red(`请填写项目名`))
    program.help()
    return
}

const list = glob.sync('*')  // 获取当前目录所有文件
let rootName = path.basename(process.cwd()) // 当前目录文件夹名词

let next = Promise.resolve(projectName)
if (list.length) {  // 如果当前目录不为空
    // 判断当前项目目录是否存在
    if (list.filter(name => {
        const fileName = path.resolve(process.cwd(), path.join('.', name))
        const isDir = fs.statSync(fileName).isDirectory()
        return name.indexOf(projectName) !== -1 && isDir
    }).length !== 0) {
        console.log(logSymbols.error, chalk.red(`项目${projectName}已经存在`))
        return
    }
} else if (rootName === projectName) { // 如果当前目录名词与项目相同
    next = inquirer.prompt([
        {
            name: 'buildInCurrent',
            message: '当前目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
            type: 'confirm',
            default: true
        }
    ]).then(answer => {
        return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
    })
}

next.then(projectRoot => {
    // 如果不是在当前项目目录中，则创建文件夹
    if (projectRoot !== '.') {
        fs.mkdirSync(projectRoot)
    }
    // 开始下载远程模板
    return download(projectRoot).then(target => {
        return {
            name: projectName,
            root: projectName,
            downloadTemp: target
        }
    })
}).then(context => {
    return inquirer.prompt([
        {
            name: 'projectName',
            message: '项目的名称',
            default: context.name
        }, {
            name: 'projectVersion',
            message: '项目的版本号',
            default: '1.0.0'
        }, {
            name: 'projectDescription',
            message: '项目的简介',
            default: `A project named ${context.name}`
        }
    ]).then(answers => {
        return {
            ...context,
            metadata: {
                ...answers
            }
        }
    })
}).then(data => {
    // 文件生成
    return generator(data, data.downloadTemp)
}).then(res => {
    console.log(logSymbols.success, chalk.green('项目创建成功 :)'))
    console.log()
    console.log(chalk.gray('您可执行下面命令进入项目'))
    console.log(chalk.cyan('cd ' + res.root + '\ncode .'))
}).catch(err => {
    console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`))
})