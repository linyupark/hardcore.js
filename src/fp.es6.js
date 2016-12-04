import { ltIE } from './hardcore/utils.es6.js';
import { RiotApp } from './hardcore/riot.app.es6.js';

let env = (env) => {
  if(env) return env;
  if(/localhost|127\.0/.test(window.location.origin)){
    return 'dev';
  }
  return 'pro';
};

if(ltIE(9)){
  window.location.href = './upgrade.html';
}
else{
  class App extends RiotApp{

    constructor(){
      super({
        id: 'fp',
        env: env('pro')
      });
    }

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

  }

  new App();
  
}
