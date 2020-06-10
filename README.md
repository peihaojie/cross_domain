<!--
 * @Date         : 2020-06-10 17:00:19
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-10 17:17:28
 * @FilePath     : \README.md
--> 
# 这是一个前端代理的Demo
### vue_cli 的代理

- 打开vue_cli4，将vue.config.js中proxyOption中的target改为自己的IP
- 将vue_cli4跑起来
- 通过node运行server内的app.js

```

// 打开 vue_cli4，修改IP后
npm run serve

// 打开 server
node app.js

```
### 打包后的express代理

- 打包之后，将dist放在proxy中
- 将proxy中的app.js的proxyOption.target改为自己的IP
- 通过node运行proxy内的app.js
- 打开http://localhost:8001

```

// 打开 proxy
node app.js

```