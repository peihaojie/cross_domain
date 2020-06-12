const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
// 反向代理
const proxyOption = {
	// 后端服务器的IP
	target: 'http://47.106.69.253:9991',
	pathRewrite: {
        '^/api/': '/' // 重写请求，api/解析为/
    },
    changeOrigin: true
}

// 静态资源路径
app.use('/', express.static('./dist'));
app.use('/api/*', createProxyMiddleware(proxyOption));
app.listen(8881);