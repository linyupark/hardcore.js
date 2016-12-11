
/**
 * php的time()
 * @return {int} 时间戳
 */
export const mkphptime = () => {
  return Number(Math.floor(Date.now() / 1000));
};

/**
 * [phpstr2time 将时间字符串转换成php时间戳]
 * @param  {string} str 时间字符串
 * @return {int}     时间戳
 */
export const phpstr2time = (str) => {
  let
    new_str = str.replace(/:/g,'-'), arr, datum;
  new_str = new_str.replace(/ /g,'-');
  arr = new_str.split("-");
  datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
  return datum.getTime() / 1000;
};

/**
 * PHP给的时间戳转成字符
 * @param  {int} time     时间戳
 * @param  {bool} showtime 是否显示分时
 * @return {str}          时间字符串
 */
export const phptime2str = (time, opts={}) => {
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
export const isIE = () => {
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
export const typeOf = mixed =>
  Object.prototype.toString.apply(mixed).match(/\[object (\w+)\]/)[1];



/**
 * 对象数据扩充
 * @param  {Object} obj 目标对象
 * @param  {object} ext 扩充对象
 * @return {object}
 */
export const assign = (obj = {}, ext = {}) => {
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
export const serialize = (obj = {}) =>
  Object.keys(obj).map(k =>
    `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
  ).join('&');



/**
 * hash search 转对象
 * ?a=a&b=b => {a:"a",b:"b"}
 * @param  {string} hash
 * @return {obj}
 */
export const search2obj = (hash = "") => {
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
export const xhr = (url, options = {}) => {
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
  xhr.addEventListener('error', () => {
    opts.fail();
  }, { once: true });
  xhr.addEventListener('loadend', () => {
    opts.complete();
  }, { once: true });
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
  xhr.complete = fn => {
    opts.complete = fn;
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
export const tagRemove = (tag, str) => {
  return str.replace(new RegExp(`<${tag}(.|\\s)*?\\/${tag}>`, "g"), "");
};



/**
 * 解析字符串中的标签内容
 * @param  {string} tag 标签名称
 * @param  {string} 解析字符串
 * @return {string}
 */
export const tagContent = function(tag, str) {
  let re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gm"),
    text = "";
  for (let match = re.exec(str); match; match = re.exec(str)) {
    text += match[1];
  }
  return text;
};



export const cookie = {
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
export const loadFile = (type = "script", url, options) => {
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
export const removeFile = (type = "script", position = "head", rel) => {
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
export const hashCode = s => {
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
export const cacheJSON = (url, options={}) => {
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
