var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (exports) {
  'use strict';

  /**
   * 将构建函数变为单件模式
   * @param  {[type]} Fn [description]
   * @return {[type]}    [description]
   */

  var createSingleton = function createSingleton(Fn) {
    var Singleton = function (_Fn) {
      _inherits(Singleton, _Fn);

      function Singleton() {
        var _ref;

        var _ret;

        _classCallCheck(this, Singleton);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Singleton.__proto__ || Object.getPrototypeOf(Singleton)).call.apply(_ref, [this].concat(args)));

        if (!Singleton.instance) {
          Singleton.instance = _this;
        }
        return _ret = Singleton.instance, _possibleConstructorReturn(_this, _ret);
      }

      return Singleton;
    }(Fn);
    return Singleton;
  };

  var trick = Object.freeze({
    createSingleton: createSingleton
  });

  /**
   * php的time()
   * @return {int} 时间戳
   */
  var mkphptime = function mkphptime() {
    return Number(Math.floor(Date.now() / 1000));
  };

  /**
   * [phpstr2time 将时间字符串转换成php时间戳]
   * @param  {string} str 时间字符串
   * @return {int}     时间戳
   */
  var phpstr2time = function phpstr2time(str) {
    var new_str = str.replace(/:/g, '-'),
        arr = void 0,
        datum = void 0;
    new_str = new_str.replace(/ /g, '-');
    arr = new_str.split("-");
    if (arr.length < 6) {
      arr[3] = arr[4] = arr[5] = '00';
    }
    datum = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
    return datum.getTime() / 1000;
  };

  /**
   * PHP给的时间戳转成字符
   * @param  {int} time     时间戳
   * @param  {bool} showtime 是否显示分时
   * @return {str}          时间字符串
   */
  var phptime2str = function phptime2str(time) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var dt = new Date(time * 1000),
        y = dt.getFullYear(),
        m = dt.getMonth() + 1,
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
    if (opts.showtime) {
      return y + sp + m + sp + d + " " + h + ":" + min + ":" + sec;
    }
    return y + sp + m + sp + d;
  };

  /**
   * 是否是IE
   */
  var isIE = function isIE() {
    var UA = window.navigator.userAgent,
        oldIE = UA.indexOf('MSIE '),
        newIE = UA.indexOf('Trident/');
    if (oldIE > -1 || newIE > -1) {
      return true;
    }
    return false;
  };

  /**
   * 优化 typeof 获取未知对象类型
   * @param  {mixed} mixed
   * @return {string}       Number|String|Object|Array|Function
   */
  var typeOf = function typeOf(mixed) {
    return Object.prototype.toString.apply(mixed).match(/\[object (\w+)\]/)[1];
  };

  /**
   * 对象数据扩充
   * @param  {Object} obj 目标对象
   * @param  {object} ext 扩充对象
   * @return {object}
   */
  var assign = function assign() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var k in ext) {
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
  var serialize = function serialize() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.keys(obj).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    }).join('&');
  };

  /**
   * hash search 转对象
   * ?a=a&b=b => {a:"a",b:"b"}
   * @param  {string} hash
   * @return {obj}
   */
  var search2obj = function search2obj() {
    var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var ret = {},
        seg = decodeURIComponent(hash).replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s = void 0;
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
  var xhr = function xhr(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var opts = assign({
      payload: false,
      formdata: false,
      method: "GET",
      data: {},
      headers: {},
      cache: false,
      type: "json",
      withCredentials: false,
      showProgress: false,
      done: function done() {},
      fail: function fail() {},
      progress: function progress() {},
      complete: function complete() {}
    }, options),
        xhr = void 0,
        progress = 0,
        send_data = [],
        has_q = url.split("/").pop().search(/\?/) !== -1;
    // 是否有缓存
    if (!opts.cache) {
      url += (has_q ? "&" : "?") + "_=" + Math.random();
      has_q = true;
    }
    // 整理发送数据
    if (opts.formdata) {
      send_data = opts.data;
    } else if (serialize(opts.data) !== "") {
      send_data.push(serialize(opts.data));
    }
    // 如果是put /post 则用formdata
    if (/^put$|^post$/i.test(opts.method) && !opts.payload) {
      opts.headers["Content-type"] = "application/x-www-form-urlencoded; charset=UTF-8";
    } else if (send_data.length > 0) {
      if (!opts.formdata) url += (has_q ? "&" : "?") + send_data;
    }
    xhr = new XMLHttpRequest();
    xhr.open(opts.method, url, true);
    for (var k in opts.headers) {
      xhr.setRequestHeader(k, opts.headers[k]);
    }
    xhr.withCredentials = opts.withCredentials;
    // 如果支持进度条
    if (opts.showProgress) {
      var progressFn = function progressFn(e) {
        if (e.lengthComputable) {
          progress = Math.round(e.loaded * 100 / e.total);
          opts.progress.call(e.target, progress);
        }
      };
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', progressFn, false);
      }
      xhr.addEventListener('progress', progressFn, false);
    }
    xhr.addEventListener('load', function (e) {
      var res = void 0;
      if (e.target.status === 200 || e.target.status === 304) {
        res = e.target.responseText;
        if (opts.type === "json") {
          res = JSON.parse(res);
        }
        opts.done.call(e.target, res);
      } else {
        opts.fail.call(e.target, e.target.status);
      }
    }, { once: true });
    xhr.addEventListener('error', function (e) {
      opts.fail.call(e.tartget, e.target.status);
    }, { once: true });
    xhr.addEventListener('loadend', function () {
      opts.complete();
    }, { once: true });
    // done().fail().progress()
    xhr.done = function (fn) {
      opts.done = fn;
      return xhr;
    };
    xhr.fail = function (fn) {
      opts.fail = fn;
      return xhr;
    };
    xhr.progress = function (fn) {
      opts.progress = fn;
      return xhr;
    };
    xhr.complete = function (fn) {
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
  var tagRemove = function tagRemove(tag, str) {
    return str.replace(new RegExp('<' + tag + '(.|\\s)*?\\/' + tag + '>', "g"), "");
  };

  /**
   * 解析字符串中的标签内容
   * @param  {string} tag 标签名称
   * @param  {string} 解析字符串
   * @return {string}
   */
  var tagContent = function tagContent(tag, str) {
    var re = new RegExp('<' + tag + '\\b[^>]*>([\\s\\S]*?)<\\/' + tag + '>', "gm"),
        text = "";
    for (var match = re.exec(str); match; match = re.exec(str)) {
      text += match[1];
    }
    return text;
  };

  var cookie = {
    /**
     * 设置 cookie
     * @param  {string} name  项
     * @param  {String} value 值
     * @param  {Object} opts  扩展配置
     * @return {null}
     */
    set: function set(name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var options = arguments[2];

      var data = {},
          cookies = [],
          opts = assign({
        path: "/",
        domain: ""
      }, options);
      if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
        throw new Error("Cookie name is required and do not use cookie reserved keywords.");
      }
      data[encodeURIComponent(name)] = encodeURIComponent(value);
      if (opts["expires"]) {
        throw new Error("Please use max-age to replace expires");
      }
      for (var opt in opts) {
        data[opt] = opts[opt];
      }
      for (var key in data) {
        cookies.push(key + '=' + data[key]);
      }
      cookies = cookies.join("; ");
      document.cookie = cookies + ';';
    },


    /**
     * 删除cookie某项
     * @param  {string} name
     * @return {null}
     */
    remove: function remove(name) {
      this.set(name, "", {
        "max-age": 0
      });
    },


    /**
     * 获取cookie某项
     * @param  {String} key [description]
     * @return {[type]}      [description]
     */
    get: function get() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = document.cookie.split("; ")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _cookie = _step.value;

          var _cookie$split = _cookie.split("="),
              _cookie$split2 = _slicedToArray(_cookie$split, 2),
              name = _cookie$split2[0],
              value = _cookie$split2[1];

          if (key !== "" && key === name) {
            return decodeURIComponent(value);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
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
  var loadFile = function loadFile() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "script";
    var url = arguments[1];
    var options = arguments[2];

    var el = document.createElement(type),
        src = {
      script: "src",
      link: "href",
      img: "src"
    },
        opts = assign({
      position: "head",
      attrs: {},
      success: function success() {},
      error: function error() {}
    }, options);

    if (!src.hasOwnProperty(type)) {
      throw new Error('File type:' + type + ' is not support dynamic load.');
    }
    if (typeof url === "undefined") {
      throw new Error("Load file url is required.");
    }
    // 扩展属性
    if (Object.keys(opts.attrs).length) {
      for (var _attr in opts.attrs) {
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
  var removeFile = function removeFile() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "script";
    var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "head";
    var rel = arguments[2];

    var i = 0,
        tags = document[position].getElementsByTagName(type);
    for (; i < tags.length; i++) {
      if (tags[i].rel === rel) tags[i].parentNode.removeChild(tags[i]);
    }
  };

  /**
   * 生成 hash
   * @param  {string} s
   * @return {hash}
   */
  var hashCode = function hashCode(s) {
    return s.split("").reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  };

  /**
   * 在浏览器关闭之前缓存ajax获取的json数据
   * @param  {String} url           [description]
   * @param  {Object} options [description]
   * @return {Object}               [description]
   */
  var cacheJSON = function cacheJSON(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var name = '_hc_json_' + url.split("/").pop().split(".")[0];
    var callback = assign({
      force: false, // true的时候强制ajax获取
      done: function done() {},
      fail: function fail() {}
    }, options);
    if ("localStorage" in window && cookie.get('' + name) && !callback.force) {
      setTimeout(function () {
        callback.done.call(null, JSON.parse(window.localStorage.getItem(name)));
      }, 0);
    } else {
      xhr(url).done(function (res) {
        // 关闭浏览器失效，保证下次浏览获取新的资源列表
        cookie.set(name, "y");
        window.localStorage && window.localStorage.setItem(name, JSON.stringify(res));
        callback.done.call(null, res);
      }).fail(function (status) {
        callback.fail.call(null, status);
      });
    }
    // 支持 done().fail()
    callback.done = function (fn) {
      callback.done = fn;
      return callback;
    };
    callback.fail = function (fn) {
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

  var emitter = function emitter() {
    var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    /**
     * 所有监听中的回调函数
     * @type {Object}
     */
    var _callbacks = {};

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
      value: function value(event, fn) {
        if (typeof fn == "function") {
          (_callbacks[event] = _callbacks[event] || []).push(fn);
          el.__emited[event] && fn.apply(el, el.__emited[event]);
        }
        return el;
      }
    });

    Object.defineProperty(el, "once", {
      value: function value(event, fn) {
        var on = function on() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

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
      value: function value(event, fn) {
        if (event === "*" && !fn) _callbacks = {};else {
          if (fn) {
            for (var _i in _callbacks[event]) {
              if (_callbacks[event][_i] == fn) _callbacks[event].splice(_i, 1);
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
      value: function value(event) {
        var fns = (_callbacks[event] || []).slice(0);

        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = fns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _fn = _step2.value;

            _fn.apply(el, args);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (_callbacks["*"] && event !== "*") el.emit.apply(el, ["*", event].concat(args));
        return el;
      }
    });

    /**
     * 设置陷阱（先于on的emit）
     */
    Object.defineProperty(el, "trap", {
      value: function value(event) {
        var fns = (_callbacks[event] || []).slice(0);

        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = fns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _fn = _step3.value;

            _fn.apply(el, args);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        el.__emited[event] = [event].concat(args);
        if (_callbacks["*"] && event !== "*") el.emit.apply(el, ["*", event].concat(args));
        return el;
      }
    });

    return el;
  };

  /**
   * 模拟标准Promise类
   */
  var Promise = void 0;
  var EmitterPromise = function () {
    function EmitterPromise() {
      var _this2 = this;

      var rr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      _classCallCheck(this, EmitterPromise);

      if (rr.length === 0) {
        throw new Error("Promise needs (resolve, reject) at least one function name.");
      }
      emitter(this);
      this._resolve = function (value) {
        _this2.emit("resolve", value);
        _this2._emited_value = value;
        _this2.off("reject");
      };
      if (rr.length === 1) {
        rr.call(this, this._resolve);
      } else {
        this._reject = function (reason) {
          _this2.emit("reject", reason);
          _this2.off("resolve");
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


    _createClass(EmitterPromise, [{
      key: 'then',


      /**
       * 当resolve执行时触发
       * @param  {Function} cb 执行回调
       * @return {EmitterPromise}
       */
      value: function then() {
        var _this3 = this;

        var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var _catch = arguments[1];

        this.once("resolve", function (value) {
          try {
            if (_this3.__chain_value instanceof Promise) {
              _this3.__chain_value.then(cb);
              return;
            }
            _this3.__chain_value = cb.call(null, _this3.__chain_value || value);
          } catch (e) {
            _this3.emit("reject", e);
          }
        });
        if (typeof _catch === "function") {
          return this.catch(_catch);
        }
        if (this._emited_value) {
          this.emit("resolve", this._emited_value);
        }
        return this;
      }

      /**
       * 当reject执行时触发
       * @param  {Function} cb 执行回调
       * @return {EmitterPromise}
       */

    }, {
      key: 'catch',
      value: function _catch() {
        var _this4 = this;

        var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        this.once("reject", function (reason) {
          var result = void 0;
          try {
            if (_this4.__no_throw) return;
            result = cb.call(null, reason);
            _this4.__no_throw = true;
            if (result) _this4.emit("resolve", result);
          } catch (e) {
            _this4.emit("reject", e);
            if (!_this4.__no_throw) {
              throw e;
            }
          }
        });
        return this;
      }
    }], [{
      key: 'all',
      value: function all() {
        var iterable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var values = [];
        return new EmitterPromise(function (resolve, reject) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = iterable[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _p = _step4.value;

              _p.then(function (value) {
                values.push(value);
                if (values.length === iterable.length) {
                  resolve(values);
                }
              }).catch(function (reason) {
                reject(reason);
              });
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        });
      }

      /**
       * 直接触发 resolve
       * @param  {mixed} value
       * @return {EmitterPromise}
       */

    }, {
      key: 'resolve',
      value: function resolve(value) {
        if (value instanceof Promise) {
          return value;
        }
        return new EmitterPromise(function (resolve) {
          setTimeout(function () {
            resolve(value);
          }, 0);
        });
      }

      /**
       * 直接触发 reject
       * @param  {mixed} reason
       * @return {EmitterPromise}
       */

    }, {
      key: 'reject',
      value: function reject(reason) {
        return new EmitterPromise(function (resolve, reject) {
          setTimeout(function () {
            reject(reason);
          }, 0);
          resolve;
        });
      }
    }]);

    return EmitterPromise;
  }();

  // 当支持原生promise的时候Promise替换成原生
  Promise = EmitterPromise;
  if ("Promise" in window) {
    Promise = window.Promise;
  }

  var Loader = function () {
    function Loader() {
      _classCallCheck(this, Loader);
    }

    _createClass(Loader, null, [{
      key: 'alias',


      /**
       * 资源别名载入（依赖模式）
       * @param {object} json json格式的资源
       * @param  {...[type]} alias_names [description]
       * @return {[type]}                [description]
       */
      value: function alias(json) {
        var alias_names = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var batch_list = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = alias_names[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var name = _step5.value;

            if (!json[name] || json[name].length === 0) continue;
            batch_list.push(json[name]);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return this.depend.apply(this, batch_list);
      }

      /**
       * 依赖载入
       * @param  {array} batch_list [前置资源,...],[后置,...]
       * @return {promise}
       */

    }, {
      key: 'depend',
      value: function depend() {
        var _this5 = this;

        for (var _len5 = arguments.length, batch_list = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          batch_list[_key5] = arguments[_key5];
        }

        var i = 0,
            fail = [],
            done = [],
            next = function next(resolve, reject) {
          if (i === batch_list.length) {
            if (fail.length > 0) {
              reject(fail);
            } else resolve(done);
          }
          _this5.batch.apply(_this5, batch_list[i]).then(function (files) {
            done = done.concat(files);
            i++;
            next(resolve, reject);
          }).catch(function (files) {
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

    }, {
      key: 'batch',
      value: function batch() {
        var _this6 = this;

        var load_files = [],
            backup_files = [],
            fail = [],
            done = [];
        // 已经通过loader加载过的文件
        this._loaded_files = this._loaded_files || [];
        // 收集重复文件，放入备份文件

        for (var _len6 = arguments.length, files = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          files[_key6] = arguments[_key6];
        }

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = files[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var f = _step6.value;

            var exist = false;
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
              for (var _iterator9 = load_files[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                var lf = _step9.value;

                if (f.split("/").pop() === lf.split("/").pop()) {
                  exist = true;
                  backup_files = backup_files.concat(f);
                }
              }
            } catch (err) {
              _didIteratorError9 = true;
              _iteratorError9 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                  _iterator9.return();
                }
              } finally {
                if (_didIteratorError9) {
                  throw _iteratorError9;
                }
              }
            }

            if (!exist) load_files = load_files.concat(f);
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }

        return new Promise(function (resolve, reject) {
          var load = function load() {
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              var _loop = function _loop() {
                var file = _step7.value;

                var name = file.split("/").pop(),
                    ext = name.split(".").pop().split("?")[0],
                    attrs = { rel: file },
                    type = _this6.types[ext];
                if (ext === "js") attrs.defer = true;
                // 之前加载过的相同文件删除
                // removeFile(type, "head", file);
                if (_this6._loaded_files.indexOf(file) !== -1) {
                  check(done.push(file));
                  return 'continue';
                }
                loadFile(type, file, {
                  attrs: attrs,
                  success: function success() {
                    _this6._loaded_files.push(file);
                    check(done.push(file));
                  },
                  error: function error() {
                    // 不留下失败文件
                    removeFile(type, "head", file);
                    check(fail.push(file));
                  }
                });
              };

              for (var _iterator7 = load_files[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var _ret2 = _loop();

                if (_ret2 === 'continue') continue;
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }
          },
              check = function check() {
            if (done.length === load_files.length) {
              return resolve(done);
            }
            if (done.length + fail.length === load_files.length) {
              // 检查是否有备份，有则再尝试
              var exist = false;
              for (var fi in fail) {
                for (var bi in backup_files) {
                  if (backup_files[bi].split("/").pop() === fail[fi].split("/").pop()) {
                    exist = true;
                    done = done.concat(backup_files[bi]);
                    backup_files.splice(bi, 1);
                  }
                }
              }
              if (exist && done.length === load_files.length) {
                // 移除已经加载的文件
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                  for (var _iterator8 = load_files[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var lf = _step8.value;

                    removeFile(_this6.types[lf.split(".").pop()], "head", lf);
                  }
                  // 替换成备份文件后能填补空缺就再执行一次
                } catch (err) {
                  _didIteratorError8 = true;
                  _iteratorError8 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                      _iterator8.return();
                    }
                  } finally {
                    if (_didIteratorError8) {
                      throw _iteratorError8;
                    }
                  }
                }

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
    }, {
      key: 'types',


      /**
       * 支持加载的文件类型
       * @return {object}
       */
      get: function get() {
        return {
          js: "script",
          css: "link"
        };
      }
    }]);

    return Loader;
  }();

  var HC = function () {
    function HC() {
      _classCallCheck(this, HC);
    }

    _createClass(HC, null, [{
      key: 'config',


      /**
       * 设置
       * @param  {Object} config
       * @return {null}
       */
      value: function config() {
        var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.config = assign({
          log: true,
          debug: true,
          // 非debug情况下出现js错误跳转页面地址
          errorPageUrl: null,
          // 上报错误地址,null不开启
          reportUrl: null,
          // 上报概率百分比
          reportChance: 1
        }, _config);

        this.log(this.config.log);
      }

      /**
       * 视情况调用console
       * @param  {string}    type 消息类型
       * @param  {arguments} msg
       * @return {null}
       */

    }, {
      key: 'console',
      value: function console(type) {
        if (this.config.debug === true && typeof window.console !== "undefined") {
          var _window$console;

          for (var _len7 = arguments.length, msg = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
            msg[_key7 - 1] = arguments[_key7];
          }

          window.console[type] && (_window$console = window.console)[type].apply(_window$console, msg);
        }
      }

      /**
       * 开启错误记录
       * @param  {Boolean} start
       * @return {null}
       */

    }, {
      key: 'log',
      value: function log() {
        var _this7 = this;

        var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var errors = [],
            msg = void 0,
            logger = emitter();
        window.onerror = function () {
          return true;
        };
        if (!start) return;
        window.addEventListener("error", function (e) {
          // 忽略跨域脚本错误
          if (e.message !== "Script error.") {
            var _msg = e.filename + ' (' + e.message + '[' + e.lineno + ':' + e.colno + '])';
            errors.push(_msg);
            _this7.console("error", _msg);
          }
          msg = errors.join("\n");
          logger.emit("error", msg);
          // 有跳转页面
          if (!_this7.config.debug && _this7.config.errorPageUrl) {
            location.href = _this7.config.errorPageUrl + '?from=' + location.href + '&msg=' + msg;
          }
          // 抽样提交
          if (_this7.config.reportUrl && Math.random() * 100 >= 100 - parseFloat(_this7.config.reportChance)) {
            xhr(_this7.config.reportUrl, {
              method: "POST",
              data: { message: msg }
            });
            _this7.console("info", "Error message reported.");
          }
          return true;
        }, false);
        return logger;
      }
    }]);

    return HC;
  }();
  HC.trick = trick;
  HC.utils = utils;
  HC.Loader = Loader;
  HC.emitter = emitter;
  HC.Promise = Promise;

  exports.HC = HC;
})(this.window = this.window || {});
