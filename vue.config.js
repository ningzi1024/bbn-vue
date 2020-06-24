const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports={
    publicPath:'/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap:false,
    devServer:{
        port: 8080,
        proxy: {
            '/api/v1': {
                target: 'http://192.168.1.226:8800/api/v1',
                // target: 'http://192.168.1.54:10088/api/v1',
                changeOrigin: true,
                timeout: 8000,
                pathRewrite: {
                    '^/api/v1': ''
                }
            },

            //远程开发使用api代理
            // '/api/v1': {
            //     target: 'https://bbnms.dev.bbniot.com/api/v1',
            //     changeOrigin: true,
            //     timeout: 10000,
            //     secure: false,
            //     pathRewrite: {
            //         '^/api/v1': ''
            //     }
            // },

            '/static/mapdata': {
                target: 'http://192.168.1.226:8800/static/mapdata',
                // target: 'http://192.168.1.111:10088/static/mapdata',
                changeOrigin: true,
                timeout: 3000,
                pathRewrite: {
                    '^/static/mapdata': ''
                }
            }
        }
    },
    css:{
        loaderOptions: {
            postcss: {
                plugins:[
                    autoprefixer(),
                    pxtorem({
                        rootValue: 100,
                        propList: ['*'],
                        selectorBlackList: ['.el-','el-','van-']
                    })
                ]
            }
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
                minChunkSize: 100
            }),
            new CompressionPlugin({
                test: /\.js$|\.css/,
                algorithm: 'gzip',
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: false
            })
        ],
        externals:{
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'axios': 'axios',
            'moment': 'moment'
        },
    },
    pages: {
        home: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/home.html',
            // 在 dist/index.html 的输出
            filename: 'home/index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Home Page',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'home']
        },
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index/index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Index Page',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
    }

}