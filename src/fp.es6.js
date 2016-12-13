import { RiotApp } from './hardcore/riot.app.es6.js';


class FP extends RiotApp {

  /**
   * 适配项目接口
   * @return {[type]} [description]
   */
  api(method, url, opts = {}) {

    const prefix = {
      dev: 'dev.',
      test: 'test.',
      pro: 'www.'
    }[this.config.env];

    let
      triggerText,
      api = this.emitter(),
      spin = document.createElement('i');

    spin.setAttribute('class', 'icon-spin2');

    // 如果设定了发起请求的元素，则在请求完毕前禁用
    this.__api = this.__api || [];
    for (let i in this.__api) {
      if (this.__api[i] === url) {
        return api.emit('fail', {
          code: '500-13',
          errmsg: '接口繁忙',
          url: url
        });
      }
    }
    this.__api.push(url);

    if (opts.trigger) {
      triggerText = opts.trigger.innerText;
      opts.trigger.innerText = '';
      opts.trigger.prepend(spin);
      opts.trigger.disabled = true;
    }

    this.xhr(`//${prefix}fp.sosho.cn/${url}`, {
      payload: opts.payload || false,
      formdata: opts.formdata || false,
      showProgress: opts.showProgress || false,
      method: method,
      data: opts.data || {},
      headers: opts.headers || {},
      cache: opts.cache || false
    }).done(resp => {
      if (resp.errno == 0){
        // this.log('api done');
        api.emit('done', resp.data || {});
      }
      else {
        // this.log('api fail');
        api.emit('error', {
          code: resp.errno || '',
          errmsg: resp.errmsg,
          url: url || ''
        });
      }
    }).progress(p => {
      api.emit('progress', p);
    }).fail(status => {
      // this.log('api fail', status);
      api.emit('fail', {
        code: status,
        errmsg: '',
        url: url
      });
    }).complete(() => {
      // this.log('api complete');
      this.__api.splice(this.__api.indexOf(url), 1);
      if (opts.trigger) {
        setTimeout(() => {
          opts.trigger.disabled = false;
          opts.trigger.innerText = triggerText;
        }, 500);
      }
      api.emit('complete', url);
    });

    api.on('fail', e => {
      this.alert('接口错误:'+e.code+' '+e.errmsg+' '+e.url, 'error');
    });

    api.on('error', e => {
      this.alert(e.errmsg, 'error');
    });

    return api;
  }

  // 要略有延迟，确保mount
  alert(msg, type='info') {
    clearTimeout(this.__timer);
    this.__timer = setTimeout(() => {
      this.emit('alert', msg, type);
    }, 500);
  }

  static detectEnv(env) {
    if (env) return env;
    if (/localhost|127\.0|192\.168/.test(window.location.href)) {
      return 'dev';
    }
    return 'pro';
  }

}

export { FP };
