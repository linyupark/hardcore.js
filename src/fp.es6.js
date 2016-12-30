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
      pro: 'www.',
      local: ''
    }[this.config.env];

    let
      triggerText,
      api = this.emitter();

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
      opts.trigger.innerText = '处理中';
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
        // 403无权限
        if(resp.errno == 403)
          window.location.replace(`${this.config.routeBase}admin-deny`);
        // 401要求重新登录
        if(resp.errno == 401){
          window.location.replace(`${this.config.routeBase}${this.config.lologinPage}?ref=${location.href}`);
          // 删除cookie
          this.utils.cookie.remove('user_name');
          this.utils.cookie.remove('user_id');
          this.utils.cookie.remove('role');
        }
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

  // 超过字符字数变...
  subText(str, max) {
    if(str.length > max){
      return str.slice(0, max) + '...';
    }
    else return str;
  }

  // 获取捐赠方类型
  getNatureName(type) {
    let name;
    this.lang.admin.agreement['donor:nature:list']
    .forEach((item) => {
      if(item.key == type) name = item.name;
    });
    return name || '';
  }

  // 项目类型列表
  getProjectTypeList(cb){
    if(this.data.projectTypeList)
      return cb(this.data.projectTypeList);
    this.api('GET', 'system-setting/project-type/search')
    .on('done', data => {
      this.data.projectTypeList = data.items;
      cb(this.data.projectTypeList);
    });
  }

  // 项目类型名称
  getProjectType(type){
    let name;
    this.getProjectTypeList(data => {
      data.forEach(item => {
        if(item.id == type){
          name = item.name;
        }
      });
    });
    return name || '-';
  }

  // 项目状态
  getProjectStatus(status) {
    let name;
    this.lang.admin.project['filter:status']
    .forEach((item) => {
      if(item.key == status) name = item.name;
    });
    return name || '';
  }

  // 校验同名input-valid全部通过
  validAll(validList) {
    let promiseList = [];
    validList.forEach(valid => {
      promiseList.push(new this.Promise((resolve, reject) => {
        valid.once('valid', () => {
          resolve();
        }).once('invalid', () => {
          reject();
        }).emit('check');
      }));
    });
    return this.Promise.all(promiseList);
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
