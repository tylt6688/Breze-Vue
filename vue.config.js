// vue.config.js
const {  defineConfig } = require('@vue/cli-service')

const port = process.env.port || process.env.npm_config_port || 80 // 前端端口

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist', // 输出文件目录
  assetsDir: 'static', // 放置静态资源
  devServer: {
    host: '0.0.0.0',
    port: port,
    proxy: 'http://localhost:8090'
    }
  })