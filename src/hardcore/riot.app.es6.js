import { xhr, assign, cacheJSON, search2obj, serialize, cookie, phpstr2time, phptime2str, mkphptime, pureText } from './utils.es6.js';
import { Loader } from './loader.es6.js';
import { emitter } from './emitter.es6.js';
import { Promise } from './promise.es6.js';
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
        lang: 'cn',
        version: '1.0',
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
      this.Promise = Promise;
      this.emitter = emitter;
      this.route = route;
      this.xhr = xhr;
      this.utils = {
        cookie: cookie,
        str2time: phpstr2time,
        time2str: phptime2str,
        time: mkphptime,
        serialize: serialize,
        pureText: pureText
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
    cacheJSON(`${cf.staticBase}${cf.id}.json?v=${cf.version}`, {
      force: cf.env !== 'pro'
    })
    .done(resp => {
      // 记录方便不刷新情况下获取
      this.data = resp;
      // 语言包
      this.lang = (resp.lang && resp.lang[cf.lang]) || {};
      Loader.alias(this.data, cf.resource)
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
            pageFile = `${cf.staticBase}riot/${cf.id}/${page}.js?v=${cf.version}`,
            tagName = `${cf.id}-${page}`;
          this.route.params = params;
          this.route.path = '';
          this.route.query = {};
          for(let i in params){
            if(typeof params[i] === 'object'){
              this.route.query = params[i];
              this.route.params.splice(i, 1);
            }
            else
              this.route.path += params[i] + '/';
          }
          this.route.path = this.route.path.slice(0, -1);
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
   * 对当前路由进行查询
   */
  query(){
    route(this.route.path+'?'+serialize(this.route.query));
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
    if(!this.data)
      return Promise.reject();
    if(this.data[resName])
      existRes = resName;
    else if(this.data[`${resName}.${this.config.env}`])
      existRes = `${resName}.${this.config.env}`;
    return Loader.alias(this.data, [existRes]);
  }

  addResources(batchName){
    return Loader.depend.apply(Loader, this.data[batchName]);
  }

}
