# xwatson-cli 说明文档
一个简单的脚手架工具，用于生成远程项目模板
### 实现目标
- 在终端中使用 ```xwatson init xxx``` 命令自动创建项目
- 询问用户项目名称、版本号、描述信息
- 下载远程GitHub模板生成项目结构
### 使用的插件
- commander - 处理命令行参数
- inquirer - 命令行交互
- ejs - 模板引擎
- download-git-repo - 下载远程git仓库
- metalsmith - 静态站点生成器
- glob - 获取文件夹下所有文件
### 实现思路
- 基于commander获取到用户命令行输入项目目录名称
- 使用promise分步骤执行异步操作
- 使用glob获取当前执行命令目录文件，用于检测项目是否存在
- 创建项目目录后，使用download-git-repo插件开始下载远程目录，远程目录配置在package.json中的tempUrl字段
- 将模板下载到项目.download-temp文件夹下临时保存
- 使用inquirer命令行交互，询问用户项目名、版本号、描述
- 将询问后的答案，传递给metalsmith插件，metalsmith插件将读取下载的模板临时目录文件，并使用ejs.render将用户答案渲染到文件中
- 文件输出后删除临时目录
- 完成项目自动创建
### 安装
- 克隆项目
```bash
git clone https://github.com/Xwatson/cli-demo.git
yarn 或 npm install
```
- link
```bash
yarn link 或 npm link
```
### 运行
```bash
xwatson init [your project name]
```