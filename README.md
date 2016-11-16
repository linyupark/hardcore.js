#hardcore.js

没有使用gulp，npm script 中使用的是 bash环境下的命令，windows下请将 
npm run xxx & npm run xxx 操作换成 npm run start xxx && npm run start

1. 安装 rollup、babel-cli、uglify-js、eslint
```
$ npm install -g rollup babel-cli uglify-js eslint
```

2. 安装项目开发依赖库
```
$ npm i -D
```

3. 进入开发模式
```
$ npm run dev
```

4. 编译
```
$ npm run build
```