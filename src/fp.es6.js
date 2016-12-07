import { RiotApp } from './hardcore/riot.app.es6.js';


class FP extends RiotApp{

  /**
   * 适配项目接口
   * @return {[type]} [description]
   */
  api(method, url, opts={}){
    const prefix = {
      dev: 'dev.',
      test: 'test.',
      pro: 'www.'
    }[this.config.env];
    // 如果设定了发起请求的元素，则在请求完毕前禁用
    this.__api = this.__api || [];
    for(let i in this.__api){
      if(this.__api[i] === url){
        return this.Promise.reject('api busy:'+url);
      }
    }
    this.__api.push(url);
    if(opts.trigger){
      opts.trigger.disabled = true;
    }
    return new this.Promise((resolve, reject) => {
      this.xhr(`//${prefix}fp.sosho.cn/${url}`, {
        method: method,
        data: opts.data || {},
        headers: opts.headers || {},
        cache: opts.cache || false
      }).done(resp => {
        if(resp.errno == 0) resolve(resp.data);
        else reject({
          code: resp.errno,
          errmsg: resp.errmsg
        });
      }).fail(status => {
        reject({
          code: status,
          errmsg: ''
        });
      }).complete(() => {
        this.__api.splice(this.__api.indexOf(url), 1);
        if(opts.trigger){
          opts.trigger.disabled = false;
        }
        this.emit('api::complete', url);
      });
    });
  }

  static detectEnv(env){
    if(env) return env;
    if(/localhost|127\.0|192\.168/.test(window.location.href)){
      return 'dev';
    }
    return 'pro';
  }

}

export { FP };
