### 基金会前端代码

安装开发环境

```
  $ npm i -g riot node-sass babel-core babel-cli uglify-js gulp browser-sync --registry http://registry.cnpmjs.org
  $ npm i -D --registry http://registry.cnpmjs.org
```

启动web服务
```
  $ npm run web
```

修改 node_modules/babel-preset-es2015-ie/index.js
```
  # 注释掉
  require('babel-plugin-transform-es2015-modules-commonjs')
  # 根据需要给不兼容的函数加上{loose: true}, 如：
  require('babel-plugin-transform-es2015-typeof-symbol', {loose: true})
```

启动自动编译，进行开发
```
  #windows
  $ npm run windev

  #mac
  $ npm run macdev
```

框架文档地址
* [riotjs](http://riotjs.com/)
* [rollup.js](http://rollupjs.org/)

Enjoy it.
