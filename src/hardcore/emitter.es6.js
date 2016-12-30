export const emitter = (el = {}) => {

  /**
   * 所有监听中的回调函数
   * @type {Object}
   */
  let _callbacks = {};

  /**
   * 寄存器
   * @type {[type]}
   */
  el._emitted = el._emitted || {};

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
        el._emitted[event] && fn.apply(el, el._emitted[event]);
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
        delete el._emitted[event];
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
      el._emitted[event] = [event].concat(args);
      if (_callbacks["*"] && event !== "*")
        el.emit.apply(el, ["*", event].concat(args));
      return el;
    }
  });

  return el;

};
