
export const emitter = (el = {}) => {

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
    for(const _e of events_array){
      fn(_e);
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
    value(events, fn){
      if(typeof fn !== "function")  return el;
      scanEvents(events, (name) => {
        (_callbacks[name] = _callbacks[name] || []).push(fn);
        if(el.__emited[name]){
          fn.apply(el, el.__emited[name]);
        }
      });
      // 支持chain写法
      return el;
    }
  });

  Object.defineProperty(el, "once", {
    value(events, fn){
      let on = (...args) => {
        el.off(events, on);
        fn.apply(el, args);
      };
      return el.on(events, on);
    }
  });

  /**
   * 解除某自定义事件
   */
  Object.defineProperty(el, "off", {
    value(events, fn){
      if(events === "*" && !fn) _callbacks = {};
      else{
        scanEvents(events, (name) => {
          if(typeof fn === "function"){
            for(const _i in _callbacks[name]){
              if(_callbacks[name][_i] == fn) 
                _callbacks[name].splice(_i, 1);
            }
          }
          else delete _callbacks[name];
          delete el.__emited[name];
        });
      }
      return el;
    }
  });

  /**
   * 触发某自定义事件
   */
  Object.defineProperty(el, "emit", {
    value(events, ...args){
      scanEvents(events, (name) => {
        const fns = _callbacks[name] || [];
        for(const _fn of fns){
          _fn.apply(el, [name].concat(args));
        }
        if(fns.length === 0){
          // 寄存未匹配到的事件
          el.__emited[name] = [name].concat(args);
        }
        // callback记录中有*，则任意name都要触发*所持fn
        if(_callbacks["*"] && name !== "*")
          el.emit.apply(el, ["*", name].concat(args));
      });
      return el;
    }
  });

  return el;

};