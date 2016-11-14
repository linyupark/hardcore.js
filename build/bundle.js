function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (exports) {
  'use strict';

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
      for (var _i in events_array) {
        fn(events_array[_i], _i);
      }
    };

    /**
     * object defineProperty 默认 
     * writable : false, configurable : false, enumerable : false
     * 避免被复写
     * 自定义事件
     */
    Object.defineProperty(el, "on", {
      value: function value(events, fn) {
        if (typeof fn !== "function") return el;
        scanEvents(events, function (name, pos) {
          (_callbacks[name] = _callbacks[name] || []).push(fn);
          // 一个函数对应了多个event name
          fn.typed = pos > 0;
        });
        // 支持chain写法
        return el;
      }
    });

    /**
     * 解除某自定义事件
     */
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

    /**
     * 触发某自定义事件
     */
    Object.defineProperty(el, "trigger", {
      value: function value(events) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        scanEvents(events, function (name) {
          var fns = _callbacks[name] || [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = fns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _fn = _step.value;

              _fn.apply(el, _fn.typed ? [name].concat(args) : args);
            }
            // callback记录中有*，则任意name都要触发*所持fn
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

          if (_callbacks["*"] && name !== "*") el.trigger.apply(el, ["*", name].concat(args));
        });
        return el;
      }
    });

    return el;
  };

  var o = { observable: observable };

  var createSingleton = function createSingleton(Fn) {

    var Singleton = function (_Fn) {
      _inherits(Singleton, _Fn);

      function Singleton() {
        var _ref;

        var _ret;

        _classCallCheck(this, Singleton);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
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

  var s = { createSingleton: createSingleton };

  var HC = function HC() {
    _classCallCheck(this, HC);
  };
  HC.observable = o.observable;
  HC.createSingleton = s.createSingleton;

  exports.HC = HC;
})(this.window = this.window || {});
