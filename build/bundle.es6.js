(function (exports) {
'use strict';

/**
 * 将构建函数变为单件模式
 * @param  {[type]} Fn [description]
 * @return {[type]}    [description]
 */
const createSingleton = Fn => {
  let Singleton = class extends Fn {
    constructor(...args) {
      super(...args);
      if (!Singleton.instance) {
        Singleton.instance = this;
      }
      return Singleton.instance;
    }
  };
  return Singleton;
};


var trick = Object.freeze({
	createSingleton: createSingleton
});

/**
 * php的time()
 * @return {int} 时间戳
 */
const mkphptime = () => {
  return Number(Math.floor(Date.now() / 1000));
};

/**
 * [phpstr2time 将时间字符串转换成php时间戳]
 * @param  {string} str 时间字符串
 * @return {int}     时间戳
 */
const phpstr2time = (str) => {
  let
    new_str = str.replace(/:/g,'-'), arr, datum;
  new_str = new_str.replace(/ /g,'-');
  arr = new_str.split("-");
  if(arr.length < 6){
    arr[3] = arr[4] = arr[5] = '00';
  }
  datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
  return datum.getTime() / 1000;
};

/**
 * PHP给的时间戳转成字符
 * @param  {int} time     时间戳
 * @param  {bool} showtime 是否显示分时
 * @return {str}          时间字符串
 */
const phptime2str = (time, opts={}) => {
  let
    dt = new Date(time * 1000),
    y = dt.getFullYear(),
    m = dt.getMonth()+1,
    d = dt.getDate(),
    h = dt.getHours(),
    min = dt.getMinutes(),
    sec = dt.getSeconds(),
    sp = opts.sp || '.';
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  h = h < 10 ? "0" + h : h;
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;
  if(opts.showtime){
    return y+sp+m+sp+d+" "+h+":"+min+":"+sec;
  }
  return y+sp+m+sp+d;
};



/**
 * 是否是IE
 */
const isIE = () => {
  let
    UA = window.navigator.userAgent,
    oldIE = UA.indexOf('MSIE '),
    newIE = UA.indexOf('Trident/');
  if(oldIE > -1 || newIE > -1){
    return true;
  }
  return false;
};


/**
 * 优化 typeof 获取未知对象类型
 * @param  {mixed} mixed
 * @return {string}       Number|String|Object|Array|Function
 */
const typeOf = mixed =>
  Object.prototype.toString.apply(mixed).match(/\[object (\w+)\]/)[1];



/**
 * 对象数据扩充
 * @param  {Object} obj 目标对象
 * @param  {object} ext 扩充对象
 * @return {object}
 */
const assign = (obj = {}, ext = {}) => {
  for (let k in ext) {
    if (ext.hasOwnProperty(k)) {
      obj[k] = ext[k];
    }
  }
  return obj;
};



/**
 * object => serialize
 * @param  {Object} obj [description]
 * @return {[type]}     [description]
 */
const serialize = (obj = {}) =>
  Object.keys(obj).map(k =>
    `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
  ).join('&');



/**
 * hash search 转对象
 * ?a=a&b=b => {a:"a",b:"b"}
 * @param  {string} hash
 * @return {obj}
 */
const search2obj = (hash = "") => {
  let ret = {},
    seg = decodeURIComponent(hash).replace(/^\?/, '').split('&'),
    len = seg.length,
    i = 0,
    s;
  for (; i < len; i++) {
    if (!seg[i]) {
      continue;
    }
    s = seg[i].split('=');
    ret[s[0]] = s[1];
  }
  return ret;
};



/**
 * xmlhttp 请求
 * @param  {string} url     请求地址
 * @param  {object} options 设置
 * @return {callback}
 */
const xhr = (url, options = {}) => {
  let opts = assign({
      payload: false,
      formdata: false,
      method: "GET",
      data: {},
      headers: {},
      cache: false,
      type: "json",
      withCredentials: false,
      showProgress: false,
      done() {},
      fail() {},
      progress() {},
      complete() {}
    }, options),
    xhr, progress = 0,
    send_data = [],
    has_q = url.split("/").pop().search(/\?/) !== -1;
  // 是否有缓存
  if (!opts.cache) {
    url += (has_q ? "&" : "?") + "_=" + Math.random();
    has_q = true;
  }
  // 整理发送数据
  if(opts.formdata){
    send_data = opts.data;
  }
  else if(serialize(opts.data) !== ""){
    send_data.push(serialize(opts.data));
  }
  // 如果是put /post 则用formdata
  if (/^put$|^post$/i.test(opts.method) && !opts.payload) {
    opts.headers["Content-type"] = "application/x-www-form-urlencoded; charset=UTF-8";
  } else if(send_data.length > 0) {
    if(!opts.formdata) url += (has_q ? "&" : "?") + send_data;
  }
  xhr = new XMLHttpRequest();
  xhr.open(opts.method, url, true);
  for (let k in opts.headers) {
    xhr.setRequestHeader(k, opts.headers[k]);
  }
  xhr.withCredentials = opts.withCredentials;
  // 如果支持进度条
  if(opts.showProgress){
    let progressFn = (e) => {
      if (e.lengthComputable) {
        progress = Math.round(e.loaded * 100 / e.total);
        opts.progress.call(e.target, progress);
      }
    };
    if(xhr.upload){
      xhr.upload.addEventListener('progress', progressFn, false);
    }
    xhr.addEventListener('progress', progressFn, false);
  }
  xhr.addEventListener('load', (e) => {
    let res;
    if (e.target.status === 200 || e.target.status === 304) {
      res = e.target.responseText;
      if (opts.type === "json") {
        res = JSON.parse(res);
      }
      opts.done.call(e.target, res);
    }
    else{
      opts.fail.call(e.target, e.target.status);
    }
  }, { once: true });
  xhr.addEventListener('error', (e) => {
    opts.fail.call(e.tartget, e.target.status);
  }, { once: true });
  xhr.addEventListener('loadend', () => {
    opts.complete();
  }, { once: true });
  // done().fail().progress()
  xhr.done = fn => {
    opts.done = fn;
    return xhr;
  };
  xhr.fail = fn => {
    opts.fail = fn;
    return xhr;
  };
  xhr.progress = fn => {
    opts.progress = fn;
    return xhr;
  };
  xhr.complete = fn => {
    opts.complete = fn;
    return xhr;
  };
  xhr.send(send_data);
  return xhr;
};



/**
 * 清除字符串中指定的标签
 * @param  {string} tag 标签名称
 * @param  {string} str 字符串
 * @return {string}
 */
const tagRemove = (tag, str) => {
  return str.replace(new RegExp(`<${tag}(.|\\s)*?\\/${tag}>`, "g"), "");
};



/**
 * 解析字符串中的标签内容
 * @param  {string} tag 标签名称
 * @param  {string} 解析字符串
 * @return {string}
 */
const tagContent = function(tag, str) {
  let re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gm"),
    text = "";
  for (let match = re.exec(str); match; match = re.exec(str)) {
    text += match[1];
  }
  return text;
};



const cookie = {
  /**
   * 设置 cookie
   * @param  {string} name  项
   * @param  {String} value 值
   * @param  {Object} opts  扩展配置
   * @return {null}
   */
  set(name, value = "", options) {
    let data = {},
      cookies = [],
      opts = assign({
        path: "/",
        domain: ""
      }, options);
    if (!name ||
      /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
      throw new Error("Cookie name is required and do not use cookie reserved keywords.");
    }
    data[encodeURIComponent(name)] = encodeURIComponent(value);
    if (opts["expires"]) {
      throw new Error("Please use max-age to replace expires");
    }
    for (let opt in opts) {
      data[opt] = opts[opt];
    }
    for (let key in data) {
      cookies.push(`${key}=${data[key]}`);
    }
    cookies = cookies.join("; ");
    document.cookie = `${cookies};`;
  },

  /**
   * 删除cookie某项
   * @param  {string} name
   * @return {null}
   */
  remove(name) {
    this.set(name, "", {
      "max-age": 0
    });
  },

  /**
   * 获取cookie某项
   * @param  {String} key [description]
   * @return {[type]}      [description]
   */
  get(key = "") {
    for (let _cookie of document.cookie.split("; ")) {
      let [name, value] = _cookie.split("=");
      if (key !== "" && key === name) {
        return decodeURIComponent(value);
      }
    }
  }

};



/**
 * 动态加载文件,建议私有化
 * @param  {String} type   加载远程文件类型 [script,link,img]
 * @param  {String} url    地址
 * @param  {Object} opts   附加配置
 * @return {Element}
 */
const loadFile = (type = "script", url, options) => {
  let el = document.createElement(type),
    src = {
      script: "src",
      link: "href",
      img: "src"
    },
    opts = assign({
      position: "head",
      attrs: {},
      success() {},
      error() {}
    }, options);

  if (!src.hasOwnProperty(type)) {
    throw new Error(`File type:${type} is not support dynamic load.`);
  }
  if (typeof url === "undefined") {
    throw new Error("Load file url is required.");
  }
  // 扩展属性
  if (Object.keys(opts.attrs).length) {
    for (let _attr in opts.attrs) {
      el[_attr] = opts.attrs[_attr];
    }
  }
  el[src[type]] = url;
  if (type === "link") {
    el.rel = "stylesheet";
  }
  el.addEventListener("load", opts.success, false);
  el.addEventListener("error", opts.error, false);
  document[opts.position].appendChild(el);
  return el;
};



/**
 * 删除动态载入的文件标签，loadFile失败后可用，建议私有化
 * @param  {String} type [description]
 * @param  {String} rel  [description]
 * @return {null}      [description]
 */
const removeFile = (type = "script", position = "head", rel) => {
  let i = 0,
    tags = document[position].getElementsByTagName(type);
  for (; i < tags.length; i++) {
    if (tags[i].rel === rel)
      tags[i].parentNode.removeChild(tags[i]);
  }
};



/**
 * 生成 hash
 * @param  {string} s
 * @return {hash}
 */
const hashCode = s => {
  return s.split("").reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
};



/**
 * 在浏览器关闭之前缓存ajax获取的json数据
 * @param  {String} url           [description]
 * @param  {Object} options [description]
 * @return {Object}               [description]
 */
const cacheJSON = (url, options={}) => {
  const name = `_hc_json_${url.split("/").pop().split(".")[0]}`;
  let callback = assign({
    force: false, // true的时候强制ajax获取
    done(){}, fail(){}
  }, options);
  if ("localStorage" in window && cookie.get(`${name}`) && !callback.force) {
    setTimeout(() => {
      callback.done.call(null, JSON.parse(window.localStorage.getItem(name)));
    }, 0);
  }
  else{
    xhr(url).done(res => {
      // 关闭浏览器失效，保证下次浏览获取新的资源列表
      cookie.set(name, "y");
      window.localStorage &&
      window.localStorage.setItem(name, JSON.stringify(res));
      callback.done.call(null, res);
    })
    .fail(status => {
      callback.fail.call(null, status);
    });
  }
  // 支持 done().fail()
  callback.done = fn => {
    callback.done = fn;
    return callback;
  };
  callback.fail = fn => {
    callback.fail = fn;
    return callback;
  };
  return callback;
};


var utils = Object.freeze({
	mkphptime: mkphptime,
	phpstr2time: phpstr2time,
	phptime2str: phptime2str,
	isIE: isIE,
	typeOf: typeOf,
	assign: assign,
	serialize: serialize,
	search2obj: search2obj,
	xhr: xhr,
	tagRemove: tagRemove,
	tagContent: tagContent,
	cookie: cookie,
	loadFile: loadFile,
	removeFile: removeFile,
	hashCode: hashCode,
	cacheJSON: cacheJSON
});

const emitter = (el = {}) => {

  /**
   * 所有监听中的回调函数
   * @type {Object}
   */
  let _callbacks = {};

  /**
   * 寄存器
   * @type {[type]}
   */
  el.__emited = el.__emited || {};

  /**
   * object defineProperty 默认
   * writable : false, configurable : false, enumerable : false
   * 避免被复写
   * 自定义事件
   */
  Object.defineProperty(el, "on", {
    value(event, fn) {
      if (typeof fn == "function"){
        (_callbacks[event] = _callbacks[event] || []).push(fn);
        el.__emited[event] && fn.apply(el, el.__emited[event]);
      }
      return el;
    }
  });

  Object.defineProperty(el, "once", {
    value(event, fn) {
      let on = (...args) => {
        el.off(event, on);
        fn.apply(el, args);
      };
      return el.on(event, on);
    }
  });

  /**
   * 解除某自定义事件
   */
  Object.defineProperty(el, "off", {
    value(event, fn) {
      if (event === "*" && !fn) _callbacks = {};
      else {
        if (fn) {
          for (const _i in _callbacks[event]) {
            if (_callbacks[event][_i] == fn)
              _callbacks[event].splice(_i, 1);
          }
        } else {
          delete _callbacks[event];
        }
        delete el.__emited[event];
      }
      return el;
    }
  });

  /**
   * 触发某自定义事件
   */
  Object.defineProperty(el, "emit", {
    value(event, ...args) {
      const fns = (_callbacks[event] || []).slice(0);
      for (let _fn of fns) {
        _fn.apply(el, args);
      }
      if (_callbacks["*"] && event !== "*")
        el.emit.apply(el, ["*", event].concat(args));
      return el;
    }
  });

  /**
   * 设置陷阱（先于on的emit）
   */
  Object.defineProperty(el, "trap", {
    value(event, ...args) {
      const fns = (_callbacks[event] || []).slice(0);
      for (let _fn of fns) {
        _fn.apply(el, args);
      }
      el.__emited[event] = [event].concat(args);
      if (_callbacks["*"] && event !== "*")
        el.emit.apply(el, ["*", event].concat(args));
      return el;
    }
  });

  return el;

};

/**
 * 模拟标准Promise类
 */
let Promise;
let EmitterPromise = class {

  constructor(rr = () => {}) {
    if (rr.length === 0) {
      throw new Error("Promise needs (resolve, reject) at least one function name.");
    }
    emitter(this);
    this._resolve = (value) => {
      this.emit("resolve", value);
      this._emited_value = value;
      this.off("reject");
    };
    if (rr.length === 1) {
      rr.call(this, this._resolve);
    } else {
      this._reject = (reason) => {
        this.emit("reject", reason);
        this.off("resolve");
      };
      rr.call(this, this._resolve, this._reject);
    }
    return this;
  }

  /**
   * EmitterPromise.all([p1, p2, p3, p4, p5]).then(values => {
      console.log(values);
    }, reason => {
      console.log(reason)
    });
   * @param  {Array}  iterable [p1,p2,p3..]
   * @return {EmitterPromise}
   */
  static all(iterable = []) {
    let values = [];
    return new EmitterPromise((resolve, reject) => {
      for (let _p of iterable) {
        _p.then(value => {
          values.push(value);
          if (values.length === iterable.length) {
            resolve(values);
          }
        }).catch(reason => {
          reject(reason);
        });
      }
    });
  }

  /**
   * 直接触发 resolve
   * @param  {mixed} value
   * @return {EmitterPromise}
   */
  static resolve(value) {
    if (value instanceof Promise) {
      return value;
    }
    return new EmitterPromise((resolve) => {
      setTimeout(function() {
        resolve(value);
      }, 0);
    });
  }

  /**
   * 直接触发 reject
   * @param  {mixed} reason
   * @return {EmitterPromise}
   */
  static reject(reason) {
    return new EmitterPromise((resolve, reject) => {
      setTimeout(function() {
        reject(reason);
      }, 0);
      resolve;
    });
  }

  /**
   * 当resolve执行时触发
   * @param  {Function} cb 执行回调
   * @return {EmitterPromise}
   */
  then(cb = () => {}, _catch) {
    this.once("resolve", value => {
      try {
        if (this.__chain_value instanceof Promise) {
          this.__chain_value.then(cb);
          return;
        }
        this.__chain_value = cb.call(null, this.__chain_value || value);
      } catch (e) {
        this.emit("reject", e);
      }
    });
    if (typeof _catch === "function") {
      return this.catch(_catch);
    }
    if(this._emited_value){
      this.emit("resolve", this._emited_value);
    }
    return this;
  }

  /**
   * 当reject执行时触发
   * @param  {Function} cb 执行回调
   * @return {EmitterPromise}
   */
  catch (cb = () => {}) {
    this.once("reject", reason => {
      let result;
      try {
        if (this.__no_throw) return;
        result = cb.call(null, reason);
        this.__no_throw = true;
        if (result) this.emit("resolve", result);
      } catch (e) {
        this.emit("reject", e);
        if (!this.__no_throw) {
          throw e;
        }
      }
    });
    return this;
  }
};

// 当支持原生promise的时候Promise替换成原生
Promise = EmitterPromise;
if ("Promise" in window) {
  Promise = window.Promise;
}

class Loader {

  /**
   * 支持加载的文件类型
   * @return {object}
   */
  static get types() {
    return {
      js: "script",
      css: "link"
    };
  }

  /**
   * 资源别名载入（依赖模式）
   * @param {object} json json格式的资源
   * @param  {...[type]} alias_names [description]
   * @return {[type]}                [description]
   */
  static alias(json, alias_names = []) {
    let batch_list = [];
    for (const name of alias_names) {
      if (!json[name] || json[name].length === 0)
        continue;
      batch_list.push(json[name]);
    }
    return this.depend.apply(this, batch_list);
  }

  /**
   * 依赖载入
   * @param  {array} batch_list [前置资源,...],[后置,...]
   * @return {promise}
   */
  static depend(...batch_list) {
    let i = 0,
      fail = [],
      done = [],
      next = (resolve, reject) => {
        if (i === batch_list.length) {
          if (fail.length > 0) {
            reject(fail);
          } else resolve(done);
        }
        this.batch.apply(this, batch_list[i])
          .then(files => {
            done = done.concat(files);
            i++;
            next(resolve, reject);
          })
          .catch(files => {
            fail = fail.concat(files);
            i++;
            next(resolve, reject);
          });
      };
    return new Promise(next);
  }

  /**
   * 并行载入
   * @param  {arguments}  files 资源,...
   * @return {promise}
   */
  static batch(...files) {
    let load_files = [],
      backup_files = [],
      fail = [],
      done = [];
    // 已经通过loader加载过的文件
    this._loaded_files = this._loaded_files || [];
    // 收集重复文件，放入备份文件
    for (const f of files) {
      let exist = false;
      for (const lf of load_files) {
        if (f.split("/").pop() === lf.split("/").pop()) {
          exist = true;
          backup_files = backup_files.concat(f);
        }
      }
      if (!exist) load_files = load_files.concat(f);
    }
    return new Promise((resolve, reject) => {
      let load = () => {
          for (const file of load_files) {
            let name = file.split("/").pop(),
              ext = name.split(".").pop().split("?")[0],
              attrs = { rel: file },
              type = this.types[ext];
            if (ext === "js") attrs.defer = true;
            // 之前加载过的相同文件删除
            // removeFile(type, "head", file);
            if(this._loaded_files.indexOf(file) !== -1){
              check(done.push(file));
              continue;
            }
            loadFile(type, file, {
              attrs: attrs,
              success: () => {
                this._loaded_files.push(file);
                check(done.push(file));
              },
              error: () => {
                // 不留下失败文件
                removeFile(type, "head", file);
                check(fail.push(file));
              }
            });
          }
        },
        check = () => {
          if (done.length === load_files.length) {
            return resolve(done);
          }
          if (done.length + fail.length === load_files.length) {
            // 检查是否有备份，有则再尝试
            let exist = false;
            for (const fi in fail) {
              for (const bi in backup_files) {
                if (backup_files[bi].split("/").pop() ===
                  fail[fi].split("/").pop()) {
                  exist = true;
                  done = done.concat(backup_files[bi]);
                  backup_files.splice(bi, 1);
                }
              }
            }
            if (exist && done.length === load_files.length) {
              // 移除已经加载的文件
              for (const lf of load_files) {
                removeFile(this.types[lf.split(".").pop()], "head", lf);
              }
              // 替换成备份文件后能填补空缺就再执行一次
              load_files = done;
              done = [];
              fail = [];
              load();
            } else {
              reject(fail);
            }
          }
        };
      load();
    });
  }

}

const HC = class {

  /**
   * 设置
   * @param  {Object} config
   * @return {null}
   */
  static config(config = {}) {

    this.config = assign({
      log: true,
      debug: true,
      // 非debug情况下出现js错误跳转页面地址
      errorPageUrl: null,
      // 上报错误地址,null不开启
      reportUrl: null,
      // 上报概率百分比
      reportChance: 1
    }, config);

    this.log(this.config.log);
  }

  /**
   * 视情况调用console
   * @param  {string}    type 消息类型
   * @param  {arguments} msg
   * @return {null}
   */
  static console(type, ...msg) {
    if (this.config.debug === true &&
      typeof window.console !== "undefined") {
      window.console[type] && window.console[type](...msg);
    }
  }

  /**
   * 开启错误记录
   * @param  {Boolean} start
   * @return {null}
   */
  static log(start = true) {
    let errors = [],
      msg, logger = emitter();
    window.onerror = () => { return true; };
    if (!start) return;
    window.addEventListener("error", (e) => {
      // 忽略跨域脚本错误
      if (e.message !== "Script error.") {
        let _msg = `${e.filename} (${e.message}[${e.lineno}:${e.colno}])`;
        errors.push(_msg);
        this.console("error", _msg);
      }
      msg = errors.join("\n");
      logger.emit("error", msg);
      // 有跳转页面
      if (!this.config.debug && this.config.errorPageUrl) {
        location.href = `${this.config.errorPageUrl}?from=${location.href}&msg=${msg}`;
      }
      // 抽样提交
      if (this.config.reportUrl &&
        Math.random() * 100 >= (100 - parseFloat(this.config.reportChance))) {
        xhr(this.config.reportUrl, {
          method: "POST",
          data: { message: msg }
        });
        this.console("info", "Error message reported.");
      }
      return true;
    }, false);
    return logger;
  }

};
HC.trick = trick;
HC.utils = utils;
HC.Loader = Loader;
HC.emitter = emitter;
HC.Promise = Promise;

exports.HC = HC;

}((this.window = this.window || {})));
