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
  // 是否有缓存
  if (!opts.cache) {
    url += (has_q ? "&" : "?") + "_=" + Math.random();
    has_q = true;
  }
  // 整理发送数据
  if(serialize(opts.data) !== ""){
    send_data.push(serialize(opts.data));
  }
  // 如果是put /post 则用formdata
  if (/^put$|^post$/i.test(opts.method)) {
    opts.headers["Content-type"] = "application/x-www-form-urlencoded";
  } else if(send_data.length > 0) {
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
      opts.progress.call(e.target, progress);
    }
  };
  xhr.onload = (e) => {
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
  };
  xhr.onerror = opts.fail;
  // done().fail().progress()
  xhr.done = fn => {
    opts.done = fn;
    return xhr;
  }
  xhr.fail = fn => {
    opts.fail = fn;
    return xhr;
  }
  xhr.progress = fn => {
    opts.progress = fn;
    return xhr;
  }
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
 * 私有函数，动态加载文件
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
 * 私有函数，删除动态载入的文件标签，loadFile失败后可用
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
 * @param  {Object} [callback={}] [description]
 * @return {Object}               [description]
 */
const cacheJSON = (url, _callback={}) => {
  const name = "_hc_cache_json_" + hashCode(url.replace(/^http[s]?:\/\//, ""));
  let callback = assign({
    done(){}, fail(){}
  }, _callback);
  if ("localStorage" in window && cookie.get(`${name}`)) {
    setTimeout(() => {
      callback.done.call(null, JSON.parse(window.localStorage.getItem(name)));
    }, 0);
  }
  else{
    xhr(url).done(res => {
      // 关闭浏览器失效，保证下次浏览获取新的资源列表
      cookie.set(name, "y");
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

export default {
  assign,
  serialize,
  xhr,
  cookie,
  search2obj,
  typeOf,
  hashCode,
  cacheJSON
};

export {
  loadFile,
  tagContent,
  tagRemove,
  removeFile
};
