var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

  /**
   * 监听者模式
   */
  var observable = function observable() {
    var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    /**
     * 所有监听中的回调函数
     * @type {Object}
     */
    var _callbacks = {},


    /**
     * 将空格分隔的事件名连同索引传递到fn
     * @param  {string}   events [description]
     * @param  {Function} fn     [description]
     */
    scanEvents = function scanEvents(events, fn) {
      var events_array = events.split(" ");
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = events_array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ev_name = _step.value;

          fn(_ev_name);
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
    };

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
      value: function value(events, fn) {
        if (typeof fn !== "function") return el;
        scanEvents(events, function (name) {
          (_callbacks[name] = _callbacks[name] || []).push(fn);
          if (el.__emited[name]) {
            // 有寄存的执行后销毁
            fn.apply(el, el.__emited[name]);
            delete el.__emited[name];
          }
        });
        // 支持chain写法
        return el;
      }
    });

    Object.defineProperty(el, "off", {
      value: function value(events, fn) {
        if (events === "*" && !fn) _callbacks = {};else {
          scanEvents(events, function (name) {
            if (typeof fn === "function") {
              for (var _i in _callbacks[name]) {
                if (_callbacks[name][_i] == fn) _callbacks[name].splice(_i, 1);
              }
            } else delete _callbacks[name];
          });
        }
        return el;
      }
    });

    Object.defineProperty(el, "once", {
      value: function value(events, fn) {
        function on() {
          el.off(events, on);

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          fn.apply(el, args);
        }
        return el.on(events, on);
      }
    });

    /**
     * 触发某自定义事件
     */
    Object.defineProperty(el, "emit", {
      value: function value(events) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        scanEvents(events, function (name) {
          var fns = _callbacks[name] || [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = fns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _fn = _step2.value;

              _fn.apply(el, [name].concat(args));
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

          if (fns.length === 0) {
            // 寄存未匹配到的事件
            el.__emited[name] = [name].concat(args);
          }
          // callback记录中有*，则任意name都要触发*所持fn
          if (_callbacks["*"] && name !== "*") el.emit.apply(el, ["*", name].concat(args));
        });
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
      observable(this);
      this._resolve = function (value) {
        _this2.emit("resolve", value);
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
      this.__chain_value;
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
      key: "then",


      /**
       * 当resolve执行时触发
       * @param  {Function} cb 执行回调
       * @return {EmitterPromise}
       */
      value: function then() {
        var _this3 = this;

        var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var _catch = arguments[1];

        this.on("resolve", function (e, value) {
          try {
            _this3.__chain_value = cb.call(null, _this3.__chain_value || value);
          } catch (e) {
            _this3.emit("reject", e);
          }
        });
        if (typeof _catch === "function") {
          this.catch(_catch);
        }
        return this;
      }

      /**
       * 当reject执行时触发
       * @param  {Function} cb 执行回调
       * @return {EmitterPromise}
       */

    }, {
      key: "catch",
      value: function _catch() {
        var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        this.on("reject", function (e, reason) {
          cb.call(null, reason);
        });
        return this;
      }
    }], [{
      key: "all",
      value: function all() {
        var iterable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var values = [];
        return new EmitterPromise(function (resolve, reject) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = iterable[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _p = _step3.value;

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
        });
      }

      /**
       * 直接触发 resolve
       * @param  {mixed} value
       * @return {EmitterPromise}
       */

    }, {
      key: "resolve",
      value: function resolve(value) {
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
      key: "reject",
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

  var trick = {
    observable: observable,
    createSingleton: createSingleton,
    Promise: Promise
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
      return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
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
      method: "GET",
      data: {},
      headers: {},
      cache: false,
      type: "json",
      done: function done() {},
      fail: function fail() {},
      progress: function progress() {}
    }, options),
        xhr = void 0,
        progress = 0,
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
      for (var k in opts.headers) {
        xhr.setRequestHeader(k, opts.headers[k]);
      }
      // 如果支持进度条
      xhr.upload.onprogress = xhr.onprogress = function (e) {
        if (e.lengthComputable) {
          progress = Math.round(e.loaded * 100 / e.total);
          opts.progress(progress);
        }
      };
      xhr.onload = function (e) {
        var res = void 0;
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
        done: function done(fn) {
          opts.done = fn;
        },
        fail: function fail(fn) {
          opts.fail = fn;
        },
        progress: function progress(fn) {
          opts.progress = fn;
        }
      };
    } catch (e) {
      throw e;
    }
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
        cookies.push(key + "=" + data[key]);
      }
      cookies = cookies.join("; ");
      document.cookie = cookies + ";";
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
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = document.cookie.split("; ")[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _cookie = _step4.value;

          var _cookie$split = _cookie.split("="),
              _cookie$split2 = _slicedToArray(_cookie$split, 2),
              name = _cookie$split2[0],
              value = _cookie$split2[1];

          if (key !== "" && key === name) {
            return decodeURIComponent(value);
          }
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
    }
  };

  /**
   * 私有函数，动态加载文件
   * @param  {String} type   加载远程文件类型 [script,link,img]
   * @param  {String} url    地址
   * @param  {Object} opts   附加配置
   * @return null
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
    }, options),
        tags = document[opts.position].getElementsByTagName(type);

    if (!src.hasOwnProperty(type)) {
      throw new Error("File type:" + type + " is not support dynamic load.");
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
    if (tags.length > 0) {
      // 一些老版本的安卓babel编译的of会报错，尽量少用of
      for (var _tag in tags) {
        if (tags[_tag][src[type]] === url) return;
      }
    }
    if (type === "link") {
      el.rel = "stylesheet";
    }
    el.addEventListener("load", opts.success, false);
    el.addEventListener("error", function () {
      opts.error.call(null, el);
      // 删除标签
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = document[opts.position].getElementsByTagName(type)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _tag2 = _step5.value;

          if (_tag2 == el) {
            _tag2.parentNode.removeChild(_tag2);
          }
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
    }, false);
    document[opts.position].appendChild(el);
  };

  /**
   * 在浏览器关闭之前缓存ajax获取的json数据
   * @param  {[type]}   url      [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  var cacheJSON = function cacheJSON(url) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    var name = url.replace(/^http[s]?:\/\//, "");
    if ("localStorage" in window && cookie.get(decodeURIComponent(name))) {
      return callback.call(null, JSON.parse(window.localStorage.getItem(name)));
    }
    try {
      xhr(url).done(function (res) {
        // 关闭浏览器失效，保证下次浏览获取新的oss资源列表
        cookie.set(decodeURIComponent(name), "y");
        window.localStorage.setItem(name, JSON.stringify(res));
        callback.call(null, res);
      });
    } catch (e) {
      throw e;
    }
  };

  var utils = {
    assign: assign,
    serialize: serialize,
    xhr: xhr,
    cookie: cookie,
    search2obj: search2obj,
    typeOf: typeOf
  };

  var Loader = function () {
    function Loader() {
      _classCallCheck(this, Loader);
    }

    _createClass(Loader, null, [{
      key: "jsonDepend",


      /**
       * 别名加载资源
       * @param  {string}    url   有资源信息的json文件地址
       * @param  {array} alias 别名组合
       * @return {promise}
       */
      value: function jsonDepend(url) {
        var _this4 = this;

        var alias = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var batches = [];
        return new trick.Promise(function (resolve, reject) {
          cacheJSON(url, function (json) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = alias[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var _name = _step6.value;

                if (json[_name]) {
                  batches.push(json[_name]);
                }
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

            _this4.batchDepend.apply(_this4, batches).then(function (res) {
              resolve(res);
            }).catch(function (i) {
              reject(i);
            });
          });
        });
      }

      /**
       * 依赖载入
       * @param  {array} batches [前置资源,...],[后置,...]
       * @return {promise}
       */

    }, {
      key: "batchDepend",
      value: function batchDepend() {
        var _this5 = this;

        for (var _len4 = arguments.length, batches = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          batches[_key4] = arguments[_key4];
        }

        if (batches.length < 2) {
          return this.batch(batches);
        }
        return new trick.Promise(function (resolve, reject) {
          var checker = function checker(i) {
            if (i < batches.length) {
              _this5.batch(batches[i]).then(function () {
                checker(i + 1);
              }).catch(function (i) {
                reject(i);
              });
            } else {
              resolve(batches);
            }
          };
          checker(0);
        });
      }

      /**
       * 并行载入
       * @param  {Array}  resource [资源,...]
       * @return {promise}
       */

    }, {
      key: "batch",
      value: function batch() {
        var _this6 = this;

        var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var promise_batch = [];
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          var _loop = function _loop() {
            var _res = _step7.value;

            promise_batch.push(new trick.Promise(function (resolve, reject) {
              var ext = _res.split(".").pop(),
                  attrs = {},
                  _i = resource.indexOf(_res);
              if (ext === "js") {
                attrs.defer = true;
              }
              if (!_this6.types[ext]) reject(_res, "文件格式不支持");else {
                loadFile(_this6.types[ext], _res, {
                  attrs: attrs,
                  success: function success() {
                    resolve(_res);
                  },
                  error: function error() {
                    reject(_i);
                  }
                });
              }
            }));
          };

          for (var _iterator7 = resource[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            _loop();
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

        return trick.Promise.all(promise_batch);
      }
    }, {
      key: "types",


      /**
       * 支持加载的文件类型
       * @return {object}
       */
      get: function get() {
        return {
          js: "script", css: "link"
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
      key: "config",


      /**
       * 设置
       * @param  {Object} config 
       * @return {null}        
       */
      value: function config() {
        var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.config = utils.assign({
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
      key: "console",
      value: function console(type) {
        if (this.config.debug === true && typeof window.console !== "undefined") {
          var _window$console;

          for (var _len5 = arguments.length, msg = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            msg[_key5 - 1] = arguments[_key5];
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
      key: "log",
      value: function log() {
        var _this7 = this;

        var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var errors = [],
            msg = void 0,
            logger = trick.observable();
        window.onerror = function () {
          return true;
        };
        if (!start) return;
        window.addEventListener("error", function (e) {
          // 忽略跨域脚本错误
          if (e.message !== "Script error.") {
            var _msg = e.filename + " (" + e.message + "[" + e.lineno + ":" + e.colno + "])";
            errors.push(_msg);
            _this7.console("error", _msg);
          }
          msg = errors.join("\n");
          logger.emit("error", msg);
          // 有跳转页面
          if (!_this7.config.debug && _this7.config.errorPageUrl) {
            location.href = _this7.config.errorPageUrl + "?from=" + location.href + "&msg=" + msg;
          }
          // 抽样提交
          if (_this7.config.reportUrl && Math.random() * 100 >= 100 - parseFloat(_this7.config.reportChance)) {
            utils.xhr(_this7.config.reportUrl, {
              method: "POST", data: { message: msg }
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

  exports.HC = HC;
})(this.window = this.window || {});
