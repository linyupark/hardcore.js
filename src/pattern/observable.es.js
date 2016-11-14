
/**
 * 监听者模式
 */
const observable = (el={}) => {

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
    for(const _i in events_array){
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
    value: (events, fn) => {
      if(typeof fn !== "function")  return el;
      scanEvents(events, (name, pos) => {
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
    value: (events, fn) => {
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
        });
      }
      return el;
    }
  });

  /**
   * 触发某自定义事件
   */
  Object.defineProperty(el, "trigger", {
    value: (events, ...args) => {
      scanEvents(events, (name) => {
        const fns = _callbacks[name] || [];
        for(const _fn of fns){
          _fn.apply(el, _fn.typed ? [name].concat(args) : args);
        }
        // callback记录中有*，则任意name都要触发*所持fn
        if(_callbacks["*"] && name !== "*")
          el.trigger.apply(el, ["*", name].concat(args));
      });
      return el;
    }
  });

  return el;

};

export default {observable};

