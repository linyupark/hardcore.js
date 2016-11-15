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

export default {
  observable,
  createSingleton
};