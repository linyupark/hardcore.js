(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.RiotApp = global.RiotApp || {})));
}(this, (function (exports) { 'use strict';

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
 * @param  {bool} showtime 显示分时规格1：年月日分秒2：月分
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
  if(opts.showtime == 1){
    return y+sp+m+sp+d+" "+h+":"+min+":"+sec;
  }
  if(opts.showtime == 2){
    return m+sp+d+" "+h+":"+min;
  }
  return y+sp+m+sp+d;
};



/**
 * 是否是IE
 */



/**
 * 优化 typeof 获取未知对象类型
 * @param  {mixed} mixed
 * @return {string}       Number|String|Object|Array|Function
 */




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


/**
 * 过滤html标签返回纯净文本
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
const pureText = (html) => {
  return html.replace(/<.*?>/g,"");
};

/**
 * 解析字符串中的标签内容
 * @param  {string} tag 标签名称
 * @param  {string} 解析字符串
 * @return {string}
 */




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
      setTimeout(() => {
        this.emit("resolve", value);
        this._emited_value = value;
        this.off("reject");
      }, 0);
    };
    if (rr.length === 1) {
      rr.call(this, this._resolve);
    } else {
      this._reject = (reason) => {
        setTimeout(() => {
          this.emit("reject", reason);
          this.off("resolve");
        }, 0);
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

/**
 * The riot template engine
 * @version v3.0.1
 */
/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

/* global riot */

var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
    },

    DEFAULT = '{ }';

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ];

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings;

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) bp = _cache;
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) return _pairs

    var arr = pair.split(' ');

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '));

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
    arr[6] = _rewrite(_pairs[6], arr);
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB);
    arr[8] = pair;
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) _bp = _cache;

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6];

    isexpr = start = re.lastIndex = 0;

    while ((match = re.exec(str))) {

      pos = match.index;

      if (isexpr) {

        if (match[2]) {
          re.lastIndex = skipBraces(str, match[2], re.lastIndex);
          continue
        }
        if (!match[3]) {
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos));
        start = re.lastIndex;
        re = _bp[6 + (isexpr ^= 1)];
        re.lastIndex = start;
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start));
    }

    return parts

    function unescapeStr (s) {
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'));
      } else {
        parts.push(s);
      }
    }

    function skipBraces (s, ch, ix) {
      var
        match,
        recch = FINDBRACES[ch];

      recch.lastIndex = ix;
      ix = 1;
      while ((match = recch.exec(s))) {
        if (match[1] &&
          !(match[1] === ch ? ++ix : --ix)) break
      }
      return ix ? s.length : recch.lastIndex
    }
  };

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  };

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9]);

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  };

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  };

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair);
      _regex = pair === DEFAULT ? _loopback : _rewrite;
      _cache[9] = _regex(_pairs[9]);
    }
    cachedBrackets = pair;
  }

  function _setSettings (o) {
    var b;

    o = o || {};
    b = o.brackets;
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    });
    _settings = o;
    _reset(b);
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  });

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
  _brackets.set = _reset;

  _brackets.R_STRINGS = R_STRINGS;
  _brackets.R_MLCOMMS = R_MLCOMMS;
  _brackets.S_QBLOCKS = S_QBLOCKS;

  return _brackets

})();

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

var tmpl = (function () {

  var _cache = {};

  function _tmpl (str, data) {
    if (!str) return str

    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
  }

  _tmpl.hasExpr = brackets.hasExpr;

  _tmpl.loopKeys = brackets.loopKeys;

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {}; };

  _tmpl.errorHandler = null;

  function _logErr (err, ctx) {

    err.riotData = {
      tagName: ctx && ctx.root && ctx.root.tagName,
      _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
    };

    if (_tmpl.errorHandler) _tmpl.errorHandler(err);
    else if (
      typeof console !== 'undefined' &&
      typeof console.error === 'function'
    ) {
      if (err.riotData.tagName) {
        console.error('Riot template error thrown in the <%s> tag', err.riotData.tagName.toLowerCase());
      }
      console.error(err);
    }
  }

  function _create (str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr;

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var
    CH_IDEXPR = String.fromCharCode(0x2057),
    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
    RE_DQUOTE = /\u2057/g,
    RE_QBMARK = /\u2057(\d+)~/g;

  function _getTmpl (str) {
    var
      qstr = [],
      expr,
      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1);

    if (parts.length > 2 || parts[0]) {
      var i, j, list = [];

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i];

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) list[j++] = expr;

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")';

    } else {

      expr = _parseExpr(parts[1], 0, qstr);
    }

    if (qstr[0]) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      });
    }
    return expr
  }

  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    };

  function _parseExpr (expr, asText, qstr) {

    expr = expr
          .replace(RE_QBLOCK, function (s, div) {
            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
          })
          .replace(/\s+/g, ' ').trim()
          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

    if (expr) {
      var
        list = [],
        cnt = 0,
        match;

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g;

        expr = RegExp.rightContext;
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];

        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re);

        jsb  = expr.slice(0, match.index);
        expr = RegExp.rightContext;

        list[cnt++] = _wrapExpr(jsb, 1, key);
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0];
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch];

      ir.lastIndex = re.lastIndex;
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) ++lv;
        else if (!--lv) break
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex;
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

  function _wrapExpr (expr, asText, key) {
    var tb;

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length;

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar;
          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '[';
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos));
        }
      }
      return match
    });

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""';

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)';
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v3.0.1';

  return _tmpl

})();

// 3.0.5

const __TAGS_CACHE = [];
const __TAG_IMPL = {};
const GLOBAL_MIXIN = '__global_mixin';
const RIOT_PREFIX = 'riot-';
const RIOT_TAG_IS = 'data-is';
const T_STRING = 'string';
const T_OBJECT = 'object';
const T_UNDEF  = 'undefined';
const T_FUNCTION = 'function';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const XLINK_REGEX = /^xlink:(\w+)/;
const WIN = typeof window === T_UNDEF ? undefined : window;
const RE_SPECIAL_TAGS = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/;
const RE_SPECIAL_TAGS_NO_OPTION = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;
const RE_RESERVED_NAMES = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|refs|parent|opts|emit|o(?:n|ff|ne))$/;
const RE_SVG_TAGS = /^(altGlyph|animate(?:Color)?|circle|clipPath|defs|ellipse|fe(?:Blend|ColorMatrix|ComponentTransfer|Composite|ConvolveMatrix|DiffuseLighting|DisplacementMap|Flood|GaussianBlur|Image|Merge|Morphology|Offset|SpecularLighting|Tile|Turbulence)|filter|font|foreignObject|g(?:lyph)?(?:Ref)?|image|line(?:arGradient)?|ma(?:rker|sk)|missing-glyph|path|pattern|poly(?:gon|line)|radialGradient|rect|stop|svg|switch|symbol|text(?:Path)?|tref|tspan|use)$/;
const RE_HTML_ATTRS = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;
const CASE_SENSITIVE_ATTRIBUTES = { 'viewbox': 'viewBox' };
const RE_BOOL_ATTRS = /^(?:disabled|checked|readonly|required|allowfullscreen|auto(?:focus|play)|compact|controls|default|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|no(?:resize|shade|validate|wrap)?|open|reversed|seamless|selected|sortable|truespeed|typemustmatch)$/;
const IE_VERSION = (WIN && WIN.document || {}).documentMode | 0;

/**
 * Check whether a DOM node must be considered a part of an svg document
 * @param   { String } name -
 * @returns { Boolean } -
 */
function isSVGTag(name) {
  return RE_SVG_TAGS.test(name)
}

/**
 * Check Check if the passed argument is undefined
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isBoolAttr(value) {
  return RE_BOOL_ATTRS.test(value)
}

/**
 * Check if passed argument is a function
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isFunction(value) {
  return typeof value === T_FUNCTION || false // avoid IE problems
}

/**
 * Check if passed argument is an object, exclude null
 * NOTE: use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isObject(value) {
  return value && typeof value === T_OBJECT // typeof null is 'object'
}

/**
 * Check if passed argument is undefined
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isUndefined(value) {
  return typeof value === T_UNDEF
}

/**
 * Check if passed argument is a string
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isString(value) {
  return typeof value === T_STRING
}

/**
 * Check if passed argument is empty. Different from falsy, because we dont consider 0 or false to be blank
 * @param { * } value -
 * @returns { Boolean } -
 */
function isBlank(value) {
  return isUndefined(value) || value === null || value === ''
}

/**
 * Check if passed argument is a kind of array
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isArray(value) {
  return Array.isArray(value) || value instanceof Array
}

/**
 * Check whether object's property could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } -
 */
function isWritable(obj, key) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return isUndefined(obj[key]) || descriptor && descriptor.writable
}

/**
 * Check if passed argument is a reserved name
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isReservedName(value) {
  return RE_RESERVED_NAMES.test(value)
}

var check = Object.freeze({
	isSVGTag: isSVGTag,
	isBoolAttr: isBoolAttr,
	isFunction: isFunction,
	isObject: isObject,
	isUndefined: isUndefined,
	isString: isString,
	isBlank: isBlank,
	isArray: isArray,
	isWritable: isWritable,
	isReservedName: isReservedName
});

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Create a document fragment
 * @returns { Object } document fragment
 */
function createFrag() {
  return document.createDocumentFragment()
}

/**
 * Create a document text node
 * @returns { Object } create a text node to use as placeholder
 */
function createDOMPlaceholder() {
  return document.createTextNode('')
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @param   { Boolean } isSvg - should we use a SVG as parent node?
 * @returns { Object } DOM node just created
 */
function mkEl(name, isSvg) {
  return isSvg ?
    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
    document.createElement(name)
}

/**
 * Get the outer html of any DOM node SVGs included
 * @param   { Object } el - DOM node to parse
 * @returns { String } el.outerHTML
 */
function getOuterHTML(el) {
  if (el.outerHTML)
    return el.outerHTML
  // some browsers do not support outerHTML on the SVGs tags
  else {
    const container = mkEl('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we'll inject new html
 * @param { String } html - html to inject
 */
function setInnerHTML(container, html) {
  if (!isUndefined(container.innerHTML))
    container.innerHTML = html;
    // some browsers do not support innerHTML on the SVGs tags
  else {
    const doc = new DOMParser().parseFromString(html, 'application/xml');
    const node = container.ownerDocument.importNode(doc.documentElement, true);
    container.appendChild(node);
  }
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name);
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name);
  if (xlink && xlink[1])
    dom.setAttributeNS(XLINK_NS, xlink[1], val);
  else
    dom.setAttribute(name, val);
}

/**
 * Insert safely a tag to fix #1962 #1649
 * @param   { HTMLElement } root - children container
 * @param   { HTMLElement } curr - node to insert
 * @param   { HTMLElement } next - node that should preceed the current node inserted
 */
function safeInsert(root, curr, next) {
  root.insertBefore(curr, next.parentNode && next);
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttrs(html, fn) {
  if (!html)
    return
  var m;
  while (m = RE_HTML_ATTRS.exec(html))
    fn(m[1].toLowerCase(), m[2] || m[3] || m[4]);
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 * @param   { Object }   context - fn can optionally return an object, which is passed to children
 */
function walkNodes(dom, fn, context) {
  if (dom) {
    const res = fn(dom, context);
    var next;
    // stop the recursion
    if (res === false) return

    dom = dom.firstChild;

    while (dom) {
      next = dom.nextSibling;
      walkNodes(dom, fn, res);
      dom = next;
    }
  }
}

var dom = Object.freeze({
	$$: $$,
	$: $,
	createFrag: createFrag,
	createDOMPlaceholder: createDOMPlaceholder,
	mkEl: mkEl,
	getOuterHTML: getOuterHTML,
	setInnerHTML: setInnerHTML,
	remAttr: remAttr,
	getAttr: getAttr,
	setAttr: setAttr,
	safeInsert: safeInsert,
	walkAttrs: walkAttrs,
	walkNodes: walkNodes
});

var styleNode;
var cssTextProp;
var byName = {};
var remainder = [];
var needsInject = false;

// skip the following code on the server
if (WIN) {
  styleNode = (function () {
    // create a new style element with the correct type
    var newNode = mkEl('style');
    setAttr(newNode, 'type', 'text/css');

    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');
    if (userNode) {
      if (userNode.id) newNode.id = userNode.id;
      userNode.parentNode.replaceChild(newNode, userNode);
    }
    else document.getElementsByTagName('head')[0].appendChild(newNode);

    return newNode
  })();
  cssTextProp = styleNode.styleSheet;
}

/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = {
  styleNode: styleNode,
  /**
   * Save a tag style to be later injected into DOM
   * @param { String } css - css string
   * @param { String } name - if it's passed we will map the css to a tagname
   */
  add(css, name) {
    if (name) byName[name] = css;
    else remainder.push(css);
    needsInject = true;
  },
  /**
   * Inject all previously saved tag styles into DOM
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   */
  inject() {
    if (!WIN || !needsInject) return
    needsInject = false;
    var style = Object.keys(byName)
      .map(function(k) { return byName[k] })
      .concat(remainder).join('\n');
    if (cssTextProp) cssTextProp.cssText = style;
    else styleNode.innerHTML = style;
  }
};

/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } list - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(list, fn) {
  const len = list ? list.length : 0;

  for (var i = 0, el; i < len; ++i) {
    el = list[i];
    // return false -> current item was removed by fn during the loop
    if (fn(el, i) === false)
      i--;
  }
  return list
}

/**
 * Check whether an array contains an item
 * @param   { Array } array - target array
 * @param   { * } item - item to test
 * @returns { Boolean } -
 */
function contains(array, item) {
  return ~array.indexOf(item)
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } str - input string
 * @returns { String } my-string -> myString
 */
function toCamel(str) {
  return str.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

/**
 * Faster String startsWith alternative
 * @param   { String } str - source string
 * @param   { String } value - test string
 * @returns { Boolean } -
 */
function startsWith(str, value) {
  return str.slice(0, value.length) === value
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
 * @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options));
  return el
}

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj, args = arguments;
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          src[key] = obj[key];
      }
    }
  }
  return src
}

var misc = Object.freeze({
	each: each,
	contains: contains,
	toCamel: toCamel,
	startsWith: startsWith,
	defineProperty: defineProperty,
	extend: extend
});

const EVENTS_PREFIX_REGEX = /^on/;

/**
 * emit DOM events
 * @param   { HTMLElement } dom - dom element target of the event
 * @param   { Function } handler - user function
 * @param   { Object } e - event object
 */
function handleEvent(dom, handler, e) {
  var ptag = this._parent,
    item = this._item;

  if (!item)
    while (ptag && !item) {
      item = ptag._item;
      ptag = ptag._parent;
    }

  // override the event properties
  if (isWritable(e, 'currentTarget')) e.currentTarget = dom;
  if (isWritable(e, 'target')) e.target = e.srcElement;
  if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode;

  e.item = item;

  handler.call(this, e);

  if (!e.preventUpdate) {
    var p = getImmediateCustomParentTag(this);
    // fixes #2083
    if (p.isMounted) p.update();
  }
}

/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {
  var eventName,
    cb = handleEvent.bind(tag, dom, handler);

  if (!dom.addEventListener) {
    dom[name] = cb;
    return
  }

  // avoid to bind twice the same event
  dom[name] = null;

  // normalize event name
  eventName = name.replace(EVENTS_PREFIX_REGEX, '');

  // cache the callback directly on the DOM node
  if (!dom._riotEvents) dom._riotEvents = {};

  if (dom._riotEvents[name])
    dom.removeEventListener(eventName, dom._riotEvents[name]);

  dom._riotEvents[name] = cb;
  dom.addEventListener(eventName, cb, false);
}

/**
 * Update dynamically created data-is tags with changing expressions
 * @param { Object } expr - expression tag and expression info
 * @param { Tag } parent - parent for tag creation
 */
function updateDataIs(expr, parent) {
  var tagName = tmpl(expr.value, parent),
    conf;

  if (expr.tag && expr.tagName === tagName) {
    expr.tag.update();
    return
  }

  // sync _parent to accommodate changing tagnames
  if (expr.tag) {
    var delName = expr.value,
      tags = expr.tag._parent.tags;

    setAttr(expr.tag.root, RIOT_TAG_IS, tagName); // update for css
    arrayishRemove(tags, delName, expr.tag);
  }

  expr.impl = __TAG_IMPL[tagName];
  conf = {root: expr.dom, parent: parent, hasImpl: true, tagName: tagName};
  expr.tag = initChildTag(expr.impl, conf, expr.dom.innerHTML, parent);
  expr.tagName = tagName;
  expr.tag.mount();
  expr.tag.update();

  // parent is the placeholder tag, not the dynamic tag so clean up
  parent.on('unmount', () => {
    var delName = expr.tag.opts.dataIs,
      tags = expr.tag.parent.tags,
      _tags = expr.tag._parent.tags;
    arrayishRemove(tags, delName, expr.tag);
    arrayishRemove(_tags, delName, expr.tag);
    expr.tag.unmount();
  });
}

/**
 * Update on single tag expression
 * @this Tag
 * @param { Object } expr - expression logic
 * @returns { undefined }
 */
function updateExpression(expr) {
  var dom = expr.dom,
    attrName = expr.attr,
    isToggle = /^(show|hide)$/.test(attrName),
    // the value for the toggle must consider also the parent tag
    value = isToggle ? tmpl(expr.expr, extend({}, this, this.parent)) : tmpl(expr.expr, this),
    isValueAttr = attrName === 'riot-value',
    isVirtual = expr.root && expr.root.tagName === 'VIRTUAL',
    parent = dom && (expr.parent || dom.parentNode),
    old;

  if (expr.bool)
    value = value ? attrName : false;
  else if (isUndefined(value) || value === null)
    value = '';

  if (expr._riot_id) { // if it's a tag
    if (expr.isMounted) {
      expr.update();

    // if it hasn't been mounted yet, do that now.
    } else {
      expr.mount();

      if (isVirtual) {
        var frag = document.createDocumentFragment();
        makeVirtual.call(expr, frag);
        expr.root.parentElement.replaceChild(frag, expr.root);
      }
    }
    return
  }

  old = expr.value;
  expr.value = value;

  if (expr.update) {
    expr.update();
    return
  }

  if (expr.isRtag && value) return updateDataIs(expr, this)
  
  if (old === value) return
  // no change, so nothing more to do

  if (isValueAttr && dom.value === value) return

  // textarea and text nodes have no attribute name
  if (!attrName) {
    // about #815 w/o replace: the browser converts the value to a string,
    // the comparison by "==" does too, but not in the server
    value += '';
    // test for parent avoids error with invalid assignment to nodeValue
    if (parent) {
      // cache the parent node because somehow it will become null on IE
      // on the next iteration
      expr.parent = parent;
      if (parent.tagName === 'TEXTAREA') {
        parent.value = value;                    // #1113
        if (!IE_VERSION) dom.nodeValue = value;  // #1625 IE throws here, nodeValue
      }                                         // will be available on 'updated'
      else dom.nodeValue = value;
    }
    return
  }

  // remove original attribute
  if (!expr.isAttrRemoved || !value) {
    remAttr(dom, attrName);
    expr.isAttrRemoved = true;
  }

  // event handler
  if (isFunction(value)) {
    setEventHandler(attrName, value, dom, this);
  // show / hide
  } else if (isToggle) {
    if (attrName === 'hide') value = !value;
    dom.style.display = value ? '' : 'none';
  // field value
  } else if (isValueAttr) {
    dom.value = value;
  // <img src="{ expr }">
  } else if (startsWith(attrName, RIOT_PREFIX) && attrName !== RIOT_TAG_IS) {
    attrName = attrName.slice(RIOT_PREFIX.length);
    if (CASE_SENSITIVE_ATTRIBUTES[attrName])
      attrName = CASE_SENSITIVE_ATTRIBUTES[attrName];
    if (value != null)
      setAttr(dom, attrName, value);
  } else {
    // <select> <option selected={true}> </select>
    if (attrName === 'selected' && parent && /^(SELECT|OPTGROUP)$/.test(parent.tagName) && value) {
      parent.value = dom.value;
    } if (expr.bool) {
      dom[attrName] = value;
      if (!value) return
    } if (value === 0 || value && typeof value !== T_OBJECT) {
      setAttr(dom, attrName, value);
    }
  }
}

/**
 * Update all the expressions in a Tag instance
 * @this Tag
 * @param { Array } expressions - expression that must be re evaluated
 */
function updateAllExpressions(expressions) {
  each(expressions, updateExpression.bind(this));
}

var IfExpr = {
  init(dom, parentTag, expr) {
    remAttr(dom, 'if');
    this.parentTag = parentTag;
    this.expr = expr;
    this.stub = document.createTextNode('');
    this.pristine = dom;

    var p = dom.parentNode;
    p.insertBefore(this.stub, dom);
    p.removeChild(dom);

    return this
  },
  update() {
    var newValue = tmpl(this.expr, this.parentTag);

    if (newValue && !this.current) { // insert
      this.current = this.pristine.cloneNode(true);
      this.stub.parentNode.insertBefore(this.current, this.stub);

      this.expressions = [];
      parseExpressions.apply(this.parentTag, [this.current, this.expressions, true]);
    } else if (!newValue && this.current) { // remove
      unmountAll(this.expressions);
      if (this.current._tag) {
        this.current._tag.unmount();
      } else if (this.current.parentNode)
        this.current.parentNode.removeChild(this.current);
      this.current = null;
      this.expressions = [];
    }

    if (newValue) updateAllExpressions.call(this.parentTag, this.expressions);
  },
  unmount() {
    unmountAll(this.expressions || []);
    delete this.pristine;
    delete this.parentNode;
    delete this.stub;
  }
};

var RefExpr = {
  init(dom, attrName, attrValue, parent) {
    this.dom = dom;
    this.attr = attrName;
    this.rawValue = attrValue;
    this.parent = parent;
    this.hasExp = tmpl.hasExpr(attrValue);
    this.firstRun = true;

    return this
  },
  update() {
    var value = this.rawValue;
    if (this.hasExp)
      value = tmpl(this.rawValue, this.parent);

    // if nothing changed, we're done
    if (!this.firstRun && value === this.value) return

    var customParent = this.parent && getImmediateCustomParentTag(this.parent);

    // if the referenced element is a custom tag, then we set the tag itself, rather than DOM
    var tagOrDom = this.tag || this.dom;

    // the name changed, so we need to remove it from the old key (if present)
    if (!isBlank(this.value) && customParent)
      arrayishRemove(customParent.refs, this.value, tagOrDom);

    if (isBlank(value)) {
      // if the value is blank, we remove it
      remAttr(this.dom, this.attr);
    } else {
      // add it to the refs of parent tag (this behavior was changed >=3.0)
      if (customParent) arrayishAdd(customParent.refs, value, tagOrDom);
      // set the actual DOM attr
      setAttr(this.dom, this.attr, value);
    }
    this.value = value;
    this.firstRun = false;
  },
  unmount() {
    var tagOrDom = this.tag || this.dom;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    if (!isBlank(this.value) && customParent)
      arrayishRemove(customParent.refs, this.value, tagOrDom);
    delete this.dom;
    delete this.parent;
  }
};

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @param   { Object } base - prototype object for the new item
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val, base) {
  var item = base ? Object.create(base) : {};
  item[expr.key] = key;
  if (expr.pos) item[expr.pos] = val;
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 * @param   { String } tagName - key used to identify the type of tag
 * @param   { Object } parent - parent tag to remove the child from
 */
function unmountRedundant(items, tags, tagName, parent) {

  var i = tags.length,
    j = items.length,
    t;

  while (i > j) {
    t = tags[--i];
    tags.splice(i, 1);
    t.unmount();
    arrayishRemove(parent.tags, tagName, t, true);
  }
}

/**
 * Move the nested custom tags in non custom loop tags
 * @this Tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(i) {
  each(Object.keys(this.tags), (tagName) => {
    var tag = this.tags[tagName];
    if (isArray(tag))
      each(tag, function (t) {
        moveChildTag.apply(t, [tagName, i]);
      });
    else
      moveChildTag.apply(tag, [tagName, i]);
  });
}

/**
 * Move a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to move
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function move(root, nextTag, isVirtual) {
  if (isVirtual)
    moveVirtual.apply(this, [root, nextTag]);
  else
    safeInsert(root, this.root, nextTag.root);
}

/**
 * Insert and mount a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to insert
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function insert(root, nextTag, isVirtual) {
  if (isVirtual)
    makeVirtual.apply(this, [root, nextTag]);
  else
    safeInsert(root, this.root, nextTag.root);
}

/**
 * Append a new tag into the DOM
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function append(root, isVirtual) {
  if (isVirtual)
    makeVirtual.call(this, root);
  else
    root.appendChild(this.root);
}

/**
 * Manage tags having the 'each'
 * @param   { HTMLElement } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 * @returns { Object } expression object for this each loop
 */
function _each(dom, parent, expr) {

  // remove the each property from the original tag
  remAttr(dom, 'each');

  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
    tagName = getTagName(dom),
    impl = __TAG_IMPL[tagName] || { tmpl: getOuterHTML(dom) },
    useRoot = RE_SPECIAL_TAGS.test(tagName),
    parentNode = dom.parentNode,
    ref = createDOMPlaceholder(),
    child = getTag(dom),
    ifExpr = getAttr(dom, 'if'),
    tags = [],
    oldItems = [],
    hasKeys,
    isLoop = true,
    isAnonymous = !__TAG_IMPL[tagName],
    isVirtual = dom.tagName === 'VIRTUAL';

  // parse the each expression
  expr = tmpl.loopKeys(expr);
  expr.isLoop = true;

  if (ifExpr) remAttr(dom, 'if');

  // insert a marked where the loop tags will be injected
  parentNode.insertBefore(ref, dom);
  parentNode.removeChild(dom);

  expr.update = function updateEach() {

    // get the new items collection
    var items = tmpl(expr.val, parent),
      frag = createFrag(),
      root = ref.parentNode;

    // object loop. any changes cause full redraw
    if (!isArray(items)) {
      hasKeys = items || false;
      items = hasKeys ?
        Object.keys(items).map(function (key) {
          return mkitem(expr, items[key], key)
        }) : [];
    } else {
      hasKeys = false;
    }

    if (ifExpr) {
      items = items.filter(function(item, i) {
        if (expr.key) {
          return !!tmpl(ifExpr, mkitem(expr, item, i, parent))
        }
        // in case it's not a keyed loop
        // we test the validity of the if expression against
        // the item and the parent
        return !!tmpl(ifExpr, parent) || !!tmpl(ifExpr, item)
      });
    }

    // loop all the new items
    each(items, function(item, i) {
      // reorder only if the items are objects
      var
        _mustReorder = mustReorder && typeof item === T_OBJECT && !hasKeys,
        oldPos = oldItems.indexOf(item),
        pos = ~oldPos && _mustReorder ? oldPos : i,
        // does a tag exist in this position?
        tag = tags[pos];

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item;

      // new tag
      if (
        !_mustReorder && !tag // with no-reorder we just update the old tags
        ||
        _mustReorder && !~oldPos // by default we always try to reorder the DOM elements
      ) {

        let mustAppend = i === tags.length;

        tag = new Tag$$1(impl, {
          parent,
          isLoop,
          isAnonymous,
          root: useRoot ? root : dom.cloneNode(),
          item
        }, dom.innerHTML);

        // mount the tag
        tag.mount();

        if (mustAppend)
          append.apply(tag, [frag || root, isVirtual]);
        else
          insert.apply(tag, [root, tags[i], isVirtual]);

        if (!mustAppend) oldItems.splice(i, 0, item);
        tags.splice(i, 0, tag);
        if (child) arrayishAdd(parent.tags, tagName, tag, true);
        pos = i; // handled here so no move
      } else tag.update(item);

      // reorder the tag if it's not located in its previous position
      if (pos !== i && _mustReorder) {
        // #closes 2040
        if (contains(items, oldItems[i])) {
          move.apply(tag, [root, tags[i], isVirtual]);
        }
        // update the position attribute if it exists
        if (expr.pos) tag[expr.pos] = i;
        // move the old tag instance
        tags.splice(i, 0, tags.splice(pos, 1)[0]);
        // move the old item
        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) moveNestedTags.call(tag, i);
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag._item = item;
      // cache the real parent tag internally
      defineProperty(tag, '_parent', parent);
    });

    // remove the redundant tags
    unmountRedundant(items, tags, tagName, parent);

    // clone the items array
    oldItems = items.slice();

    root.insertBefore(frag, ref);
  };

  expr.unmount = function() {
    each(tags, function(t) { t.unmount(); });
  };

  return expr
}

/**
 * Walk the tag DOM to detect the expressions to evaluate
 * @this Tag
 * @param   { HTMLElement } root - root tag where we will start digging the expressions
 * @param   { Array } expressions - empty array where the expressions will be added
 * @param   { Boolean } mustIncludeRoot - flag to decide whether the root must be parsed as well
 * @returns { Object } an object containing the root noode and the dom tree
 */
function parseExpressions(root, expressions, mustIncludeRoot) {
  var tree = {parent: {children: expressions}};

  walkNodes(root, (dom, ctx) => {
    let type = dom.nodeType, parent = ctx.parent, attr, expr, tagImpl;
    if (!mustIncludeRoot && dom === root) return {parent: parent}

    // text node
    if (type === 3 && dom.parentNode.tagName !== 'STYLE' && tmpl.hasExpr(dom.nodeValue))
      parent.children.push({dom: dom, expr: dom.nodeValue});

    if (type !== 1) return ctx // not an element

    // loop. each does it's own thing (for now)
    if (attr = getAttr(dom, 'each')) {
      parent.children.push(_each(dom, this, attr));
      return false
    }

    // if-attrs become the new parent. Any following expressions (either on the current
    // element, or below it) become children of this expression.
    if (attr = getAttr(dom, 'if')) {
      parent.children.push(Object.create(IfExpr).init(dom, this, attr));
      return false
    }

    if (expr = getAttr(dom, RIOT_TAG_IS)) {
      if (tmpl.hasExpr(expr)) {
        parent.children.push({isRtag: true, expr: expr, dom: dom});
        return false
      }
    }

    // if this is a tag, stop traversing here.
    // we ignore the root, since parseExpressions is called while we're mounting that root
    tagImpl = getTag(dom);
    if (tagImpl && (dom !== root || mustIncludeRoot)) {
      var conf = {root: dom, parent: this, hasImpl: true};
      parent.children.push(initChildTag(tagImpl, conf, dom.innerHTML, this));
      return false
    }

    // attribute expressions
    parseAttributes.apply(this, [dom, dom.attributes, function(attr, expr) {
      if (!expr) return
      parent.children.push(expr);
    }]);

    // whatever the parent is, all child elements get the same parent.
    // If this element had an if-attr, that's the parent for all child elements
    return {parent: parent}
  }, tree);

  return { tree, root }
}

/**
 * Calls `fn` for every attribute on an element. If that attr has an expression,
 * it is also passed to fn.
 * @this Tag
 * @param   { HTMLElement } dom - dom node to parse
 * @param   { Array } attrs - array of attributes
 * @param   { Function } fn - callback to exec on any iteration
 */
function parseAttributes(dom, attrs, fn) {
  each(attrs, (attr) => {
    var name = attr.name, bool = isBoolAttr(name), expr;

    if (~['ref', 'data-ref'].indexOf(name)) {
      expr =  Object.create(RefExpr).init(dom, name, attr.value, this);
    } else if (tmpl.hasExpr(attr.value)) {
      expr = {dom: dom, expr: attr.value, attr: attr.name, bool: bool};
    }

    fn(attr, expr);
  });
}

/*
  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/

const reHasYield  = /<yield\b/i;
const reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig;
const reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig;
const reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
const rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' };
const tblTags = IE_VERSION && IE_VERSION < 10 ? RE_SPECIAL_TAGS : RE_SPECIAL_TAGS_NO_OPTION;
const GENERIC = 'div';


/*
  Creates the root element for table or select child elements:
  tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
*/
function specialTags(el, tmpl$$1, tagName) {

  var
    select = tagName[0] === 'o',
    parent = select ? 'select>' : 'table>';

  // trim() is important here, this ensures we don't have artifacts,
  // so we can check if we have only one element inside the parent
  el.innerHTML = '<' + parent + tmpl$$1.trim() + '</' + parent;
  parent = el.firstChild;

  // returns the immediate parent if tr/th/td/col is the only element, if not
  // returns the whole tree, as this can include additional elements
  if (select) {
    parent.selectedIndex = -1;  // for IE9, compatible w/current riot behavior
  } else {
    // avoids insertion of cointainer inside container (ex: tbody inside tbody)
    var tname = rootEls[tagName];
    if (tname && parent.childElementCount === 1) parent = $(tname, parent);
  }
  return parent
}

/*
  Replace the yield tag from any tag template with the innerHTML of the
  original tag in the page
*/
function replaceYield(tmpl$$1, html) {
  // do nothing if no yield
  if (!reHasYield.test(tmpl$$1)) return tmpl$$1

  // be careful with #1343 - string on the source having `$1`
  var src = {};

  html = html && html.replace(reYieldSrc, function (_, ref, text) {
    src[ref] = src[ref] || text;   // preserve first definition
    return ''
  }).trim();

  return tmpl$$1
    .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
      return src[ref] || def || ''
    })
    .replace(reYieldAll, function (_, def) {        // yield without any "from"
      return html || def || ''
    })
}

/**
 * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
 * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
 *
 * @param   { String } tmpl  - The template coming from the custom tag definition
 * @param   { String } html - HTML content that comes from the DOM element where you
 *           will mount the tag, mostly the original tag in the page
 * @param   { Boolean } checkSvg - flag needed to know if we need to force the svg rendering in case of loop nodes
 * @returns { HTMLElement } DOM element with _tmpl_ merged through `YIELD` with the _html_.
 */
function mkdom(tmpl$$1, html, checkSvg) {
  var match   = tmpl$$1 && tmpl$$1.match(/^\s*<([-\w]+)/),
    tagName = match && match[1].toLowerCase(),
    el = mkEl(GENERIC, checkSvg && isSVGTag(tagName));

  // replace all the yield tags with the tag inner html
  tmpl$$1 = replaceYield(tmpl$$1, html);

  /* istanbul ignore next */
  if (tblTags.test(tagName))
    el = specialTags(el, tmpl$$1, tagName);
  else
    setInnerHTML(el, tmpl$$1);

  el.stub = true;

  return el
}

/**
 * Another way to create a riot tag a bit more es6 friendly
 * @param { HTMLElement } el - tag DOM selector or DOM node/s
 * @param { Object } opts - tag logic
 * @returns { Tag } new riot tag instance
 */
function Tag$1(el, opts) {
  // get the tag properties from the class constructor
  var {name, tmpl: tmpl$$1, css, attrs, onCreate} = this;
  // register a new tag and cache the class prototype
  if (!__TAG_IMPL[name]) {
    tag$$1(name, tmpl$$1, css, attrs, onCreate);
    // cache the class constructor
    __TAG_IMPL[name].class = this.constructor;
  }

  // mount the tag using the class instance
  mountTo(el, name, opts, this);
  // inject the component css
  if (css) styleManager.inject();

  return this
}

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag$$1(name, tmpl$$1, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs;

    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css;
      css = '';
    } else
      attrs = '';
  }

  if (css) {
    if (isFunction(css))
      fn = css;
    else
      styleManager.add(css);
  }

  name = name.toLowerCase();
  __TAG_IMPL[name] = { name, tmpl: tmpl$$1, attrs, fn };

  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag2$$1(name, tmpl$$1, css, attrs, fn) {
  if (css)
    styleManager.add(css, name);

  var exists = !!__TAG_IMPL[name];
  __TAG_IMPL[name] = { name, tmpl: tmpl$$1, attrs, fn };

  if (exists && util.hotReloader)
    util.hotReloader(name);

  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { * } selector - tag DOM selector or DOM node/s
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
function mount$$1(selector, tagName, opts) {
  var tags = [];

  function pushTagsTo(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, RIOT_TAG_IS);

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName;
        setAttr(root, RIOT_TAG_IS, tagName);
      }

      var tag$$1 = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);

      if (tag$$1)
        tags.push(tag$$1);
    } else if (root.length)
      each(root, pushTagsTo); // assume nodeList
  }

  // inject styles into DOM
  styleManager.inject();

  if (isObject(tagName)) {
    opts = tagName;
    tagName = 0;
  }

  var elem;
  var allTags;

  // crawl the DOM to find the tag
  if (isString(selector)) {
    selector = selector === '*' ?
      // select all registered tags
      // & tags found with the riot-tag attribute set
      allTags = selectTags() :
      // or just the ones named like the selector
      selector + selectTags(selector.split(/, */));

    // make sure to pass always a selector
    // to the querySelectorAll function
    elem = selector ? $$(selector) : [];
  }
  else
    // probably you have passed already a tag or a NodeList
    elem = selector;

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectTags();
    // if the root els it's just a single tag
    if (elem.tagName)
      elem = $$(tagName, elem);
    else {
      // select all the children for all the different root elements
      var nodeList = [];

      each(elem, _el => nodeList.push($$(tagName, _el)));

      elem = nodeList;
    }
    // get rid of the tagName
    tagName = 0;
  }

  pushTagsTo(elem);

  return tags
}

// Create a mixin that could be globally shared across all the tags
const mixins = {};
const globals = mixins[GLOBAL_MIXIN] = {};
var _id = 0;

/**
 * Create/Return a mixin by its name
 * @param   { String }  name - mixin name (global mixin if object)
 * @param   { Object }  mix - mixin logic
 * @param   { Boolean } g - is global?
 * @returns { Object }  the mixin logic
 */
function mixin$$1(name, mix, g) {
  // Unnamed global
  if (isObject(name)) {
    mixin$$1(`__unnamed_${_id++}`, name, true);
    return
  }

  const store = g ? globals : mixins;

  // Getter
  if (!mix) {
    if (isUndefined(store[name]))
      throw new Error('Unregistered mixin: ' + name)

    return store[name]
  }

  // Setter
  store[name] = isFunction(mix) ?
    extend(mix.prototype, store[name] || {}) && mix :
    extend(store[name] || {}, mix);
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
function update$$1() {
  return each(__TAGS_CACHE, tag$$1 => tag$$1.update())
}

function unregister$$1(name) {
  delete __TAG_IMPL[name];
}

// counter to give a unique id to all the Tag instances
var __uid = 0;

/**
 * We need to update opts for this tag. That requires updating the expressions
 * in any attributes on the tag, and then copying the result onto opts.
 * @this Tag
 * @param   {Boolean} isLoop - is it a loop tag?
 * @param   { Tag }  parent - parent tag node
 * @param   { Boolean }  isAnonymous - is it a tag without any impl? (a tag not registered)
 * @param   { Object }  opts - tag options
 * @param   { Array }  instAttrs - tag attributes array
 */
function updateOpts(isLoop, parent, isAnonymous, opts, instAttrs) {
  // isAnonymous `each` tags treat `dom` and `root` differently. In this case
  // (and only this case) we don't need to do updateOpts, because the regular parse
  // will update those attrs. Plus, isAnonymous tags don't need opts anyway
  if (isLoop && isAnonymous) return

  var ctx = !isAnonymous && isLoop ? this : parent || this;
  each(instAttrs, (attr) => {
    if (attr.expr) updateAllExpressions.call(ctx, [attr.expr]);
    opts[toCamel(attr.name)] = attr.expr ? attr.expr.value : attr.value;
  });
}


/**
 * Tag class
 * @constructor
 * @param { Object } impl - it contains the tag template, and logic
 * @param { Object } conf - tag options
 * @param { String } innerHTML - html that eventually we need to inject in the tag
 */
function Tag$$1(impl, conf, innerHTML) {

  var opts = extend({}, conf.opts),
    parent = conf.parent,
    isLoop = conf.isLoop,
    isAnonymous = conf.isAnonymous,
    item = cleanUpData(conf.item),
    instAttrs = [], // All attributes on the Tag when it's first parsed
    implAttrs = [], // expressions on this type of Tag
    expressions = [],
    root = conf.root,
    tagName = conf.tagName || getTagName(root),
    isVirtual = tagName === 'virtual',
    propsInSyncWithParent = [],
    dom;

  // make this tag observable
  emitter(this);
  // only call unmount if we have a valid __TAG_IMPL (has name property)
  if (impl.name && root._tag) root._tag.unmount(true);

  // not yet mounted
  this.isMounted = false;
  root.isLoop = isLoop;

  defineProperty(this, '_internal', {
    isAnonymous,
    instAttrs,
    innerHTML,
    // these vars will be needed only for the virtual tags
    virts: [],
    tail: null,
    head: null
  });

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++__uid); // base 1 allows test !t._riot_id

  extend(this, { root, opts }, item);
  // protect the "tags" and "refs" property from being overridden
  defineProperty(this, 'parent', parent || null);
  defineProperty(this, 'tags', {});
  defineProperty(this, 'refs', {});

  dom = mkdom(impl.tmpl, innerHTML, isLoop);

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'update', function tagUpdate(data) {
    if (isFunction(this.shouldUpdate) && !this.shouldUpdate(data)) return this

    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data);

    // inherit properties from the parent, but only for isAnonymous tags
    if (isLoop && isAnonymous) inheritFrom.apply(this, [this.parent, propsInSyncWithParent]);
    extend(this, data);
    updateOpts.apply(this, [isLoop, parent, isAnonymous, opts, instAttrs]);
    if (this.isMounted) this.emit('update', data);
    updateAllExpressions.call(this, expressions);
    if (this.isMounted) this.emit('updated');

    return this

  }.bind(this));

  /**
   * Add a mixin to this tag
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mixin', function tagMixin() {
    each(arguments, (mix) => {
      var instance,
        props = [],
        obj;

      mix = isString(mix) ? mixin$$1(mix) : mix;

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix();
      } else instance = mix;

      var proto = Object.getPrototypeOf(instance);

      // build multilevel prototype inheritance chain property list
      do props = props.concat(Object.getOwnPropertyNames(obj || instance));
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, (key) => {
        // bind methods to this
        // allow mixins to override other properties/parent mixins
        if (key !== 'init') {
          // check for getters/setters
          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!this.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(this, key, descriptor);
          } else {
            this[key] = isFunction(instance[key]) ?
              instance[key].bind(this) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init)
        instance.init.bind(this)();
    });
    return this
  }.bind(this));

  /**
   * Mount the current tag instance
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mount', function tagMount() {
    root._tag = this; // keep a reference to the tag just created

    // Read all the attrs on this instance. This give us the info we need for updateOpts
    parseAttributes.apply(parent, [root, root.attributes, (attr, expr) => {
      if (!isAnonymous && RefExpr.isPrototypeOf(expr)) expr.tag = this;
      attr.expr = expr;
      instAttrs.push(attr);
    }]);

    // update the root adding custom attributes coming from the compiler
    implAttrs = [];
    walkAttrs(impl.attrs, (k, v) => { implAttrs.push({name: k, value: v}); });
    parseAttributes.apply(this, [root, implAttrs, (attr, expr) => {
      if (expr) expressions.push(expr);
      else setAttr(root, attr.name, attr.value);
    }]);

    // children in loop should inherit from true parent
    if (this._parent && isAnonymous) inheritFrom.apply(this, [this._parent, propsInSyncWithParent]);

    // initialiation
    updateOpts.apply(this, [isLoop, parent, isAnonymous, opts, instAttrs]);

    // add global mixins
    var globalMixin = mixin$$1(GLOBAL_MIXIN);

    if (globalMixin) {
      for (var i in globalMixin) {
        if (globalMixin.hasOwnProperty(i)) {
          this.mixin(globalMixin[i]);
        }
      }
    }

    if (impl.fn) impl.fn.call(this, opts);

    this.emit('before-mount');

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions.apply(this, [dom, expressions, false]);

    this.update(item);

    if (isLoop && isAnonymous) {
      // update the root attribute for the looped elements
      this.root = root = dom.firstChild;
    } else {
      while (dom.firstChild) root.appendChild(dom.firstChild);
      if (root.stub) root = parent.root;
    }

    defineProperty(this, 'root', root);
    this.isMounted = true;

    // if it's not a child tag we can emit its mount event
    if (!this.parent || this.parent.isMounted) {
      this.emit('mount');
    }
    // otherwise we need to wait that the parent event gets emited
    else this.parent.once('mount', () => {
      this.emit('mount');
    });

    return this

  }.bind(this));

  /**
   * Unmount the tag instance
   * @param { Boolean } mustKeepRoot - if it's true the root node will not be removed
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'unmount', function tagUnmount(mustKeepRoot) {
    var el = this.root,
      p = el.parentNode,
      ptag,
      tagIndex = __TAGS_CACHE.indexOf(this);

    this.emit('before-unmount');

    // clear all attributes coming from the mounted tag
    walkAttrs(impl.attrs, (name) => {
      if (startsWith(name, RIOT_PREFIX))
        name = name.slice(RIOT_PREFIX.length);
      remAttr(root, name);
    });

    // remove this tag instance from the global virtualDom variable
    if (~tagIndex)
      __TAGS_CACHE.splice(tagIndex, 1);

    if (p) {
      if (parent) {
        ptag = getImmediateCustomParentTag(parent);

        if (isVirtual) {
          Object.keys(this.tags).forEach(tagName => {
            arrayishRemove(ptag.tags, tagName, this.tags[tagName]);
          });
        } else {
          arrayishRemove(ptag.tags, tagName, this);
        }
      } else {
        while (el.firstChild) el.removeChild(el.firstChild);
      }

      if (!mustKeepRoot) {
        p.removeChild(el);
      } else {
        // the riot-tag and the data-is attributes aren't needed anymore, remove them
        remAttr(p, RIOT_TAG_IS);
      }
    }

    if (this._internal.virts) {
      each(this._internal.virts, (v) => {
        if (v.parentNode) v.parentNode.removeChild(v);
      });
    }

    // allow expressions to unmount themselves
    unmountAll(expressions);
    each(instAttrs, a => a.expr && a.expr.unmount && a.expr.unmount());

    this.emit('unmount');
    this.off('*');
    this.isMounted = false;

    delete this.root._tag;

    return this

  }.bind(this));
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __TAG_IMPL[getAttr(dom, RIOT_TAG_IS) ||
    getAttr(dom, RIOT_TAG_IS) || dom.tagName.toLowerCase()]
}

/**
 * Inherit properties from a target tag instance
 * @this Tag
 * @param   { Tag } target - tag where we will inherit properties
 * @param   { Array } propsInSyncWithParent - array of properties to sync with the target
 */
function inheritFrom(target, propsInSyncWithParent) {
  each(Object.keys(target), (k) => {
    // some properties must be always in sync with the parent tag
    var mustSync = !isReservedName(k) && contains(propsInSyncWithParent, k);

    if (isUndefined(this[k]) || mustSync) {
      // track the property to keep in sync
      // so we can keep it updated
      if (!mustSync) propsInSyncWithParent.push(k);
      this[k] = target[k];
    }
  });
}

/**
 * Move the position of a custom tag in its parent tag
 * @this Tag
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tagName, newPos) {
  var parent = this.parent,
    tags;
  // no parent no move
  if (!parent) return

  tags = parent.tags[tagName];

  if (isArray(tags))
    tags.splice(newPos, 0, tags.splice(tags.indexOf(this), 1)[0]);
  else arrayishAdd(parent.tags, tagName, this);
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = new Tag$$1(child, opts, innerHTML),
    tagName = opts.tagName || getTagName(opts.root, true),
    ptag = getImmediateCustomParentTag(parent);
  // fix for the parent attribute in the looped elements
  defineProperty(tag, 'parent', ptag);
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag._parent = parent;

  // add this tag to the custom parent tag
  arrayishAdd(ptag.tags, tagName, tag);

  // and also to the real parent tag
  if (ptag !== parent)
    arrayishAdd(parent.tags, tagName, tag);

  // empty the child node once we got its template
  // to avoid that its children get compiled multiple times
  opts.root.innerHTML = '';

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag;
  while (ptag._internal.isAnonymous) {
    if (!ptag.parent) break
    ptag = ptag.parent;
  }
  return ptag
}

/**
 * emit the unmount method on all the expressions
 * @param   { Array } expressions - DOM expressions
 */
function unmountAll(expressions) {
  each(expressions, function(expr) {
    if (expr instanceof Tag$$1) expr.unmount(true);
    else if (expr.unmount) expr.unmount();
  });
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { Boolean } skipDataIs - hack to ignore the data-is attribute when attaching to parent
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom, skipDataIs) {
  var child = getTag(dom),
    namedTag = !skipDataIs && getAttr(dom, RIOT_TAG_IS);
  return namedTag && !tmpl.hasExpr(namedTag) ?
                namedTag :
              child ? child.name : dom.tagName.toLowerCase()
}

/**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
function cleanUpData(data) {
  if (!(data instanceof Tag$$1) && !(data && typeof data.emit === T_FUNCTION))
    return data

  var o = {};
  for (var key in data) {
    if (!RE_RESERVED_NAMES.test(key)) o[key] = data[key];
  }
  return o
}

/**
 * Set the property of an object for a given key. If something already
 * exists there, then it becomes an array containing both the old and new value.
 * @param { Object } obj - object on which to set the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be set
 * @param { Boolean } ensureArray - ensure that the property remains an array
 */
function arrayishAdd(obj, key, value, ensureArray) {
  var dest = obj[key];
  var isArr = isArray(dest);

  if (dest && dest === value) return

  // if the key was never set, set it once
  if (!dest && ensureArray) obj[key] = [value];
  else if (!dest) obj[key] = value;
  // if it was an array and not yet set
  else if (!isArr || isArr && !contains(dest, value)) {
    if (isArr) dest.push(value);
    else obj[key] = [dest, value];
  }
}

/**
 * Removes an item from an object at a given key. If the key points to an array,
 * then the item is just removed from the array.
 * @param { Object } obj - object on which to remove the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be removed
 * @param { Boolean } ensureArray - ensure that the property remains an array
*/
function arrayishRemove(obj, key, value, ensureArray) {
  if (isArray(obj[key])) {
    each(obj[key], function(item, i) {
      if (item === value) obj[key].splice(i, 1);
    });
    if (!obj[key].length) delete obj[key];
    else if (obj[key].length === 1 && !ensureArray) obj[key] = obj[key][0];
  } else
    delete obj[key]; // otherwise just delete the key
}

/**
 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
 * @param   { Object }  dom - DOM node we want to parse
 * @returns { Boolean } -
 */
function isInStub(dom) {
  while (dom) {
    if (dom.inStub)
      return true
    dom = dom.parentNode;
  }
  return false
}

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @param   { Object } ctx - optional context that will be used to extend an existing class ( used in riot.Tag )
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts, ctx) {
  var impl = __TAG_IMPL[tagName],
    implClass = __TAG_IMPL[tagName].class,
    tag = ctx || (implClass ? Object.create(implClass.prototype) : {}),
    // cache the inner HTML to fix #855
    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;

  // clear the inner html
  root.innerHTML = '';

  var conf = { root: root, opts: opts };
  if (opts && opts.parent) conf.parent = opts.parent;

  if (impl && root) Tag$$1.apply(tag, [impl, conf, innerHTML]);

  if (tag && tag.mount) {
    tag.mount(true);
    // add this tag to the virtualDom variable
    if (!contains(__TAGS_CACHE, tag)) __TAGS_CACHE.push(tag);
  }

  return tag
}


/**
 * Adds the elements for a virtual tag
 * @this Tag
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function makeVirtual(src, target) {
  var head = createDOMPlaceholder(),
    tail = createDOMPlaceholder(),
    frag = createFrag(),
    sib, el;

  this._internal.head = this.root.insertBefore(head, this.root.firstChild);
  this._internal.tail = this.root.appendChild(tail);

  el = this._internal.head;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    this._internal.virts.push(el); // hold for unmounting
    el = sib;
  }

  if (target)
    src.insertBefore(frag, target._internal.head);
  else
    src.appendChild(frag);
}

/**
 * Move virtual tag and all child nodes
 * @this Tag
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 */
function moveVirtual(src, target) {
  var el = this._internal.head,
    frag = createFrag(),
    sib;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    el = sib;
    if (el === this._internal.tail) {
      frag.appendChild(el);
      src.insertBefore(frag, target._internal.head);
      break
    }
  }
}

/**
 * Get selectors for tags
 * @param   { Array } tags - tag names to select
 * @returns { String } selector
 */
function selectTags(tags) {
  // select all tags
  if (!tags) {
    var keys = Object.keys(__TAG_IMPL);
    return keys + selectTags(keys)
  }

  return tags
    .filter(t => !/[^-\w]/.test(t))
    .reduce((list, t) => {
      var name = t.trim().toLowerCase();
      return list + `,[${RIOT_TAG_IS}="${name}"]`
    }, '')
}


var tags = Object.freeze({
	getTag: getTag,
	inheritFrom: inheritFrom,
	moveChildTag: moveChildTag,
	initChildTag: initChildTag,
	getImmediateCustomParentTag: getImmediateCustomParentTag,
	unmountAll: unmountAll,
	getTagName: getTagName,
	cleanUpData: cleanUpData,
	arrayishAdd: arrayishAdd,
	arrayishRemove: arrayishRemove,
	isInStub: isInStub,
	mountTo: mountTo,
	makeVirtual: makeVirtual,
	moveVirtual: moveVirtual,
	selectTags: selectTags
});

/**
 * Riot public api
 */

const settings = Object.create(brackets.settings);
const util = {
  tmpl,
  brackets,
  styleManager,
  vdom: __TAGS_CACHE,
  styleNode: styleManager.styleNode,
  // export the riot internal utils as well
  dom,
  check,
  misc,
  tags
};




var riot$1 = Object.freeze({
	settings: settings,
	util: util,
	observable: emitter,
	Tag: Tag$1,
	tag: tag$$1,
	tag2: tag2$$1,
	mount: mount$$1,
	mixin: mixin$$1,
	update: update$$1,
	unregister: unregister$$1
});

/**
 * Simple client-side router
 * @module riot-route
 */

const RE_ORIGIN = /^.+?\/\/+[^\/]+/;
const EVENT_LISTENER = 'EventListener';
const REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER;
const ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER;
const HAS_ATTRIBUTE = 'hasAttribute';
const POPSTATE = 'popstate';
const HASHCHANGE = 'hashchange';
const TRIGGER = 'emit';
const MAX_EMIT_STACK_LEVEL = 3;
const win = typeof window != 'undefined' && window;
const doc = typeof document != 'undefined' && document;
const hist = win && history;
const loc = win && (hist.location || win.location);
const prot = Router.prototype;
const clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click';
const central = emitter();

let started = false;
let routeFound = false;
let debouncedEmit;
let base;
let current;
let parser;
let secondParser;
let emitStack = [];
let emitStackLevel = 0;

/**
 * Default parser. You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @returns {array} array
 */
function DEFAULT_PARSER(path) {
  return path.split(/[/?#]/)
}

/**
 * Default parser (second). You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @param {string} filter - filter string (normalized)
 * @returns {array} array
 */
function DEFAULT_SECOND_PARSER(path, filter) {
  const f = filter
    .replace(/\?/g, '\\?')
    .replace(/\*/g, '([^/?#]+?)')
    .replace(/\.\./, '.*');
  const re = new RegExp(`^${f}$`);
  const args = path.match(re);

  if (args) return args.slice(1)
}

/**
 * Simple/cheap debounce implementation
 * @param   {function} fn - callback
 * @param   {number} delay - delay in seconds
 * @returns {function} debounced function
 */
function debounce(fn, delay) {
  let t;
  return function () {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  }
}

/**
 * Set the window listeners to trigger the routes
 * @param {boolean} autoExec - see route.start
 */
function start(autoExec) {
  debouncedEmit = debounce(emit, 1);
  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit);
  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
  doc[ADD_EVENT_LISTENER](clickEvent, click);
  if (autoExec) emit(true);
}

/**
 * Router class
 */
function Router() {
  this.$ = [];
  emitter(this); // make it observable
  central.on('stop', this.s.bind(this));
  central.on('emit', this.e.bind(this));
}

function normalize(path) {
  return path.replace(/^\/|\/$/, '')
}

function isString$1(str) {
  return typeof str == 'string'
}

/**
 * Get the part after domain name
 * @param {string} href - fullpath
 * @returns {string} path from root
 */
function getPathFromRoot(href) {
  return (href || loc.href).replace(RE_ORIGIN, '')
}

/**
 * Get the part after base
 * @param {string} href - fullpath
 * @returns {string} path from base
 */
function getPathFromBase(href) {
  return base[0] === '#'
    ? (href || loc.href || '').split(base)[1] || ''
    : (loc ? getPathFromRoot(href) : href || '').replace(base, '')
}

function emit(force) {
  // the stack is needed for redirections
  const isRoot = emitStackLevel === 0;
  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return

  emitStackLevel++;
  emitStack.push(function() {
    const path = getPathFromBase();
    if (force || path !== current) {
      central[TRIGGER]('emit', path);
      current = path;
    }
  });
  if (isRoot) {
    let first;
    while (first = emitStack.shift()) first(); // stack increses within this call
    emitStackLevel = 0;
  }
}

function click(e) {
  if (
    e.which !== 1 // not left click
    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
    || e.defaultPrevented // or default prevented
  ) return

  let el = e.target;
  while (el && el.nodeName !== 'A') el = el.parentNode;

  if (
    !el || el.nodeName !== 'A' // not A tag
    || el[HAS_ATTRIBUTE]('download') // has download attr
    || !el[HAS_ATTRIBUTE]('href') // has no href attr
    || el.target && el.target !== '_self' // another window or frame
    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) === -1 // cross origin
  ) return

  if (el.href !== loc.href
    && (
      el.href.split('#')[0] === loc.href.split('#')[0] // internal jump
      || base[0] !== '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
      || base[0] === '#' && el.href.split(base)[0] !== loc.href.split(base)[0] // outside of #base
      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
    )) return

  e.preventDefault();
}

/**
 * Go to the path
 * @param {string} path - destination path
 * @param {string} title - page title
 * @param {boolean} shouldReplace - use replaceState or pushState
 * @returns {boolean} - route not found flag
 */
function go(path, title, shouldReplace) {
  // Server-side usage: directly execute handlers for the path
  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))

  path = base + normalize(path);
  title = title || doc.title;
  // browsers ignores the second parameter `title`
  shouldReplace
    ? hist.replaceState(null, title, path)
    : hist.pushState(null, title, path);
  // so we need to set it manually
  doc.title = title;
  routeFound = false;
  emit();
  return routeFound
}

/**
 * Go to path or set action
 * a single string:                go there
 * two strings:                    go there with setting a title
 * two strings and boolean:        replace history with setting a title
 * a single function:              set an action on the default route
 * a string/RegExp and a function: set an action on the route
 * @param {(string|function)} first - path / action / filter
 * @param {(string|RegExp|function)} second - title / action
 * @param {boolean} third - replace flag
 */
prot.m = function(first, second, third) {
  if (isString$1(first) && (!second || isString$1(second))) go(first, second, third || false);
  else if (second) this.r(first, second);
  else this.r('@', first);
};

/**
 * Stop routing
 */
prot.s = function() {
  this.off('*');
  this.$ = [];
};

/**
 * Emit
 * @param {string} path - path
 */
prot.e = function(path) {
  this.$.concat('@').some(function(filter) {
    const args = (filter === '@' ? parser : secondParser)(normalize(path), normalize(filter));
    if (typeof args != 'undefined') {
      this[TRIGGER].apply(null, [filter].concat(args));
      return routeFound = true // exit from loop
    }
  }, this);
};

/**
 * Register route
 * @param {string} filter - filter for matching to url
 * @param {function} action - action to register
 */
prot.r = function(filter, action) {
  if (filter !== '@') {
    filter = '/' + normalize(filter);
    this.$.push(filter);
  }
  this.on(filter, action);
};

const mainRouter = new Router();
const route = mainRouter.m.bind(mainRouter);

/**
 * Create a sub router
 * @returns {function} the method of a new Router object
 */
route.create = function() {
  const newSubRouter = new Router();
  // assign sub-router's main method
  const router = newSubRouter.m.bind(newSubRouter);
  // stop only this sub-router
  router.stop = newSubRouter.s.bind(newSubRouter);
  return router
};

/**
 * Set the base of url
 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
 */
route.base = function(arg) {
  base = arg || '#';
  current = getPathFromBase(); // recalculate current path
};

/** Exec routing right now **/
route.exec = function() {
  emit(true);
};

/**
 * Replace the default router to yours
 * @param {function} fn - your parser function
 * @param {function} fn2 - your secondParser function
 */
route.parser = function(fn, fn2) {
  if (!fn && !fn2) {
    // reset parser for testing...
    parser = DEFAULT_PARSER;
    secondParser = DEFAULT_SECOND_PARSER;
  }
  if (fn) parser = fn;
  if (fn2) secondParser = fn2;
};

/**
 * Helper function to get url query as an object
 * @returns {object} parsed query
 */
route.query = function() {
  const q = {};
  const href = loc.href || current;
  href.replace(/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v; });
  return q
};

/** Stop routing **/
route.stop = function () {
  if (started) {
    if (win) {
      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit);
      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
      doc[REMOVE_EVENT_LISTENER](clickEvent, click);
    }
    central[TRIGGER]('stop');
    started = false;
  }
};

/**
 * Start routing
 * @param {boolean} autoExec - automatically exec after starting if true
 */
route.start = function (autoExec) {
  if (!started) {
    if (win) {
      if (document.readyState === 'complete') start(autoExec);
      // the timeout is needed to solve
      // a weird safari bug https://github.com/riot/route/issues/33
      else win[ADD_EVENT_LISTENER]('load', function() {
        setTimeout(function() { start(autoExec); }, 1);
      });
    }
    started = true;
  }
};

/** Prepare the router **/
route.base();
route.parser();

class RiotApp {

  constructor(options={}){
    // 单例化
    if(!this.instance){
      // window.riot
      window.riot = riot$1;
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
              let tag$$1 = riot$1.mount(cf.mountPage, tagName)[0],
                ctags = (tag$$1) => {
                  for(let childTagName in tag$$1.tags){
                    this.tagMounted[childTagName] = tag$$1.tags[childTagName];
                    ctags(tag$$1.tags[childTagName]);
                  }
                };
              this.tagMounted[tagName] = tag$$1;
              ctags(tag$$1);
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
        riot$1.mixin({ app: this });

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

exports.FP = FP;

Object.defineProperty(exports, '__esModule', { value: true });

})));
