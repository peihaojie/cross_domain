/*
 * @Date         : 2020-06-10 14:39:32
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-10 15:58:59
 * @FilePath     : \vue.config.js
 */
/* eslint-disable */
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: "./",
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "localhost", //表示启动的时候使用的域名，默认可以不写，则是使用localhost和本机IP
    port: '8000', // 设置端口号
    proxy: {
      '/api': {
        target: 'http://192.168.1.15:3000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/base'))
      .set('views', resolve('src/views'))
      .set('static', resolve('src/static'))
      .set('utils', resolve('src/utils'))
  }
}
