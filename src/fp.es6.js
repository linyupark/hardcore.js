import { xhr, assign, cacheJSON, search2obj, cookie } from './hardcore/utils.es6.js';
import { Loader } from './hardcore/loader.es6.js';
import { emitter } from './hardcore/emitter.es6.js';
import riot from './hardcore/riot.core.es6.js';
import route from './hardcore/riot.route.es6.js';

export class FP {

  constructor(options={}){
    // 单例化
    if(!FP.instance){
      // 可监听化
      emitter(this);
      // 配置信息
      this.config = assign({
        id: 'fp', // 项目id
        env: 'dev', // 环境
        staticBase: './static/',
        routeBase: '#!', // route解析分隔符
        mountPage: '#main', // 页面逻辑挂载点
        loginPage: 'login',
        indexPage: 'index',
        errorPage: '500',
        notFoundPage: '404',
        resource: [] // 需要预先加载的资源
      }, options);
      // 记录已经加载的tag
      this.tagMounted = {};
      // 合并组件
      window.riot = riot;
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
    const cf = this.config;
    // 初始化必要资源
    cf.resource.push(this.config.env);
    cacheJSON(`${cf.staticBase}${cf.id}.json`, {
      force: cf.env !== 'pro'
    })
    .done(resp => {
      // 记录方便不刷新情况下获取
      this.loaderJSON = resp;
      Loader.alias(this.loaderJSON, cf.resource)
      .then(files => {
        // 开始初始化路由
        route.base(cf.routeBase);
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
            page = params[0] || cf.indexPage,
            pageFile = `${cf.staticBase}riot/${cf.id}/${page}.js`,
            tagName = `${cf.id}-${page}`;
          this.route.params = params;
          Loader.batch(pageFile).then(() => {
            try{
              let tag = riot.mount(cf.mountPage, tagName)[0],
                ctags = (tag) => {
                  for(let childTagName in tag.tags){
                    this.tagMounted[childTagName] = tag.tags[childTagName];
                    ctags(tag.tags[childTagName]);
                  }
                };
              this.tagMounted[tagName] = tag;
              ctags(tag);
            } catch(e) {
              route(`/${cf.errorPage}?message=${e.message}`);
              window.console.error(e);
            }
          }).catch(() => {
            route('/' + cf.notFoundPage);
          });
        });
        // 开始监听路由变化
        route((...args) => {
          this.emit('route::change', args);
        });
        // 启动路由
        route.start(true);

        // 将项目实例导入riot全局app对象
        riot.mixin({ app: this });

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
