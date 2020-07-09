const Metalsmith = require('metalsmith') // 站点生成器
const ejs = require('ejs') // 模板引擎
const rm = require('rimraf').sync
const path = require('path')

module.exports = (data = {}, src) => {
    if (!src) {
        return Promise.reject(new Error(`无效的source：${src}`))
    }
    return new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata(data)
            .clean(true)
            .source(src)
            .destination('.')
            .use((files, metalsmith, done) => {
                const meta = metalsmith.metadata()
                Object.keys(files).forEach(fileName => {
                    const content = files[fileName].contents.toString()
                    files[fileName].contents = Buffer.from(ejs.render(content, meta.metadata))
                })
                done()
            }).build(err => {
                // 删除下载模板临时文件
                rm(src)
                err ? reject(err) : resolve(data)
            })
    })
}