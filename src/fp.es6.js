import { xhr, assign, cacheJSON, search2obj, cookie } from './hardcore/utils.es6.js';
import { Loader } from './hardcore/loader.es6.js';
import { emitter } from './hardcore/emitter.es6.js';
import route from './hardcore/riot.route.es6.js';

export class FP {

  constructor(options={}){
    // 单例化
    if(!FP.instance){
      // 可监听化
      emitter(this);
      // 配置信息
      this.config = assign({
        id: 'fp',
        env: 'dev', // 环境
        staticBase: './static/',
        routeBase: '#!', // route解析分隔符
        mountPage: '#page', // 页面逻辑挂载点
        loginPage: 'login',
        indexPage: 'index',
        errorPage: '500',
        notFoundPage: '400',
        resource: ['riot']
      }, options);
      // 合并组件
      this.route = route;
      this.utils = {
        cookie: cookie
      };
      // 初始化操作
      this.init();
      FP.instance = this;
    }
    return FP.instance;
  }

  init(){

    // 初始化必要资源
    this.config.resource.push(this.config.env);
    cacheJSON(this.config.staticBase('loader.json'))
    .done(resp => {
      // 记录方便不刷新情况下获取
      this.loaderJSON = resp[this.config.id];
      Loader.alias(this.loaderJSON, this.config.resource)
      .then(files => {
        // 开始初始化路由
        route.base(this.config.routeBase);
        // 路由解析方式
        route.parser(path => {
          const raw = path.split('?'),
            uri = raw[0].split('/'),
            qs = raw[1];
          if (qs) uri.push(search2obj(qs));
          return uri;
        });
        // 设置路由控制
        this.on('route::change', params => {
          let
            page = params[0] || this.config.indexPage,
            pageFile = this.config.staticBase(
              `riot/${this.config.id}/${page}.js`),
            tagName = `${this.config.id}-${page}`;
          this.route.params = params;
          Loader.batch(pageFile).then(() => {
            try{
              window.riot.mount(this.config.mountPage, tagName);
            } catch(e) {
              route(`/${this.config.errorPage}?message=${e.message}`);
            }
          }).catch(() => {
            route('/${this.config.notFoundPage}');
          });
        });
        // 开始监听路由变化
        route((...args) => {
          this.emit('route::change', args);
        });
        // 启动路由
        route.start(true);
        // 将项目实例导入riot全局app对象
        window.riot.mixin({ app: this });
        this.emit('init::done', files);
      })
      .catch(files => {
        this.emit('init::fail', files);
      });
    });

  }

  /**
   * 适配项目接口
   * @return {[type]} [description]
   */
  api(method, url, data){
    const prefix = {dev: 'dev.', test: 'test.', pro: ''}[this.config.env];
    return xhr(`//${prefix}h5.sosho.cn/server/${url}`, {
      method: method,
      data: data,
      headers: {}
    });
  }

  /**
   * 追加资源载入
   */
  addResource(resName){
    let existRes;
    if(!this.loaderJSON)
      return Promise.reject();
    if(this.loaderJSON[resName])
      existRes = resName;
    else if(this.loaderJSON[`${resName}.${this.config.env}`])
      existRes = `${resName}.${this.config.env}`;
    return Loader.alias(this.loaderJSON, [existRes]);
  }

}
