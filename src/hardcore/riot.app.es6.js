import { xhr, assign, cacheJSON, search2obj, cookie } from './utils.es6.js';
import { Loader } from './loader.es6.js';
import { emitter } from './emitter.es6.js';
import riot from './riot.core.es6.js';
import route from './riot.route.es6.js';


export class RiotApp {

  constructor(options={}){
    // 单例化
    if(!this.instance){
      // window.riot
      window.riot = riot;
      // 可监听化
      emitter(this);
      // 配置信息
      this.config = assign({
        id: 'app', // 项目id
        env: 'dev', // 环境
        staticBase: './static/',
        routeBase: '#!', // route解析分隔符
        mountPage: 'page', // 页面逻辑挂载点
        loginPage: 'login',
        indexPage: 'index',
        errorPage: '500',
        notFoundPage: '404',
        resource: [] // 需要预先加载的资源
      }, options);
      // 记录已经加载的tag
      this.tagMounted = {};
      // 合并组件
      this.route = route;
      this.xhr = xhr;
      this.utils = {
        cookie: cookie
      };
      // 初始化操作
      this.init();
      this.instance = this;
    }
    return this.instance;
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
              window.location.replace(
                `${cf.routeBase}/${cf.errorPage}?message=${e.message}`
              );
              this.err(e);
            }
          }).catch(() => {
            window.location.replace(cf.routeBase+'/'+cf.notFoundPage);
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
   * 信息打印
   */
  log(...args){
    return this.config.dev !== 'pro' ?
      window.console && window.console.log(...args) : null;
  }
  err(...args){
    return window.console && window.console.error(...args);
  }

  /**
   * 适配项目接口
   */
  api(){}

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
