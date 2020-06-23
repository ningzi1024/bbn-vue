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
    }

}