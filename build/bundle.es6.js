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


/**
 * 监听者模式
 */
const observable = (el = {}) => {

  /**
   * 所有监听中的回调函数
   * @type {Object}
   */
  let _callbacks = {},

    /**
     * 将空格分隔的事件名连同索引传递到fn
     * @param  {string}   events [description]
     * @param  {Function} fn     [description]
     */
    scanEvents = (events, fn) => {
      const events_array = events.split(" ");
      for (const _ev_name of events_array) {
        fn(_ev_name);
      }
    };

  /**
   * object defineProperty 默认 
   * writable : false, configurable : false, enumerable : false
   * 避免被复写
   * 自定义事件
   */
  Object.defineProperty(el, "on", {
    value(events, fn){
      if (typeof fn !== "function") return el;
      scanEvents(events, (name) => {
        (_callbacks[name] = _callbacks[name] || []).push(fn);
      });
      // 支持chain写法
      return el;
    }
  });

  Object.defineProperty(el, "off", {
    value(events, fn){
      if (events === "*" && !fn) _callbacks = {};
      else {
        scanEvents(events, (name) => {
          if (typeof fn === "function") {
            for (const _i in _callbacks[name]) {
              if (_callbacks[name][_i] == fn)
                _callbacks[name].splice(_i, 1);
            }
          } else delete _callbacks[name];
        });
      }
      return el;
    }
  });

  Object.defineProperty(el, "once", {
    value(events, fn){
      function on(...args) {
        el.off(events, on);
        fn.apply(el, args);
      }
      return el.on(events, on);
    }
  });

  /**
   * 触发某自定义事件
   */
  Object.defineProperty(el, "emit", {
    value(events, ...args){
      scanEvents(events, (name) => {
        const fns = _callbacks[name] || [];
        for (const _fn of fns) {
          _fn.apply(el, [name].concat(args));
        }
        // callback记录中有*，则任意name都要触发*所持fn
        if (_callbacks["*"] && name !== "*")
          el.emit.apply(el, ["*", name].concat(args));
      });
      return el;
    }
  });

  return el;

};

var trick = {
  observable,
  createSingleton
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
      method: "GET",
      data: {},
      headers: {},
      cache: false,
      type: "json",
      done() {},
      fail() {},
      progress() {}
    }, options),
    xhr, progress = 0,
    send_data = [],
    has_q = url.split("/").pop().search(/\?/) !== -1;
  try {
    // 是否有缓存
    if (!opts.cache) {
      url += (has_q ? "&" : "?") + "_=" + Math.random();
      has_q = true;
    }
    // 整理发送数据
    send_data.push(serialize(opts.data));
    // 如果是put /post 则用formdata
    if (/^put$|^post$/i.test(opts.method)) {
      opts.headers["Content-type"] = "application/x-www-form-urlencoded";
    } else {
      url += (has_q ? "&" : "?") + send_data;
    }
    xhr = new XMLHttpRequest();
    xhr.open(opts.method, url, true);
    for (let k in opts.headers) {
      xhr.setRequestHeader(k, opts.headers[k]);
    }
    // 如果支持进度条
    xhr.upload.onprogress = xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        progress = Math.round(e.loaded * 100 / e.total);
        opts.progress(progress);
      }
    };
    xhr.onload = (e) => {
      let res;
      if (e.target.status === 200) {
        res = e.target.responseText;
        if (opts.type === "json") {
          res = JSON.parse(res);
        }
        opts.done.call(e.target, res);
      }
    };
    xhr.send(send_data);
    // 支持 xhr(...).done(fn).fail(fn);
    return {
      done(fn) {
        opts.done = fn;
      },
      fail(fn) {
        opts.fail = fn;
      },
      progress(fn) {
        opts.progress = fn;
      }
    };
  } catch (e) {
    throw e;
  }
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



var utils = {
  assign,
  serialize,
  xhr,
  cookie,
  search2obj,
  typeOf
};

const HC = class {

  /**
   * 设置
   * @param  {Object} config 
   * @return {null}        
   */
  static config(config = {}) {
    
    this.config = utils.assign({
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
  static console(type, ...msg){
    if(this.config.debug === true 
      && typeof window.console !== "undefined"){
      window.console[type] && window.console[type](...msg);
    }
  }

  /**
   * 开启错误记录
   * @param  {Boolean} start
   * @return {null}
   */
  static log(start=true){
    let errors = [], msg, logger = trick.observable();
    window.onerror = () => { return true; };
    if(!start) return;
    window.addEventListener("error", (e) => {
      // 忽略跨域脚本错误
      if(e.message !== "Script error."){
        let _msg = `${e.filename} (${e.message}[${e.lineno}:${e.colno}])`;
        errors.push(_msg);
        this.console("error", _msg);
      }
      msg = errors.join("\n");
      logger.emit("error", msg);
      // 有跳转页面
      if(!this.config.debug && this.config.errorPageUrl){
        location.href = `${this.config.errorPageUrl}?from=${location.href}&msg=${msg}`;
      }
      // 抽样提交
      if(this.config.reportUrl && 
        Math.random()*100 >= (100-parseFloat(this.config.reportChance))){
        utils.xhr(this.config.reportUrl, {
          method: "POST", data: { message: msg }
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

exports.HC = HC;

}((this.window = this.window || {})));
