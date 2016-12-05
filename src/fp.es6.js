import { RiotApp } from './hardcore/riot.app.es6.js';



class FP extends RiotApp{

  /**
   * 适配项目接口
   * @return {[type]} [description]
   */
  api(method, url, data){
    const prefix = {dev: 'dev.', test: 'test.', pro: ''}[this.config.env];
    return this.xhr(`//${prefix}h5.sosho.cn/server/${url}`, {
      method: method,
      data: data,
      headers: {}
    });
  }

  static detectEnv(env){
    if(env) return env;
    if(/localhost|127\.0|192\.168/.test(window.location.origin)){
      return 'dev';
    }
    return 'pro';
  }

}

export { FP };
