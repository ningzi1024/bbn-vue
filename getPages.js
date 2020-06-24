// 多页配置
let path = require('path')
let glob = require('glob')

/**
 * 动态获取文件目录所有页面
 * @param globalPath
 * @return {{}}
 * 用法 let pages = getEntry('./src/views/**?/*.html')
 */
function getEntry(globalPath) {
    let entries = {}; let basename; let tmp; let pathname;
    glob.sync(globalPath).forEach(function(entry){
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        console.log(tmp);
        pathname = basename;
        entries[pathname] = {
            entry: ['src/utils/flexible.js', 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[1] + '.js'],
            template: 'src/'+ tmp[0] + '/' + tmp[1] + '/' + tmp[2],
            title: tmp[2],
            filename: tmp[1] + '/index.html'
        }
    });
    return entries;
}

module.exports = getEntry;

