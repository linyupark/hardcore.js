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



/**
 * 模拟标准Promise类
 */
let Promise;
let EmitterPromise = class {

  constructor(rr=()=>{}){
    if(rr.length === 0){
      throw new Error("Promise needs (resolve, reject) at least one function name.");
    }
    observable(this);
    this._resolve = (value) => {
      this.emit("resolve", value);
      this.off("reject");
    };
    if(rr.length === 1){
      rr.call(this, this._resolve);
    }
    else{
      this._reject = (reason) => {
        this.emit("reject", reason);
        this.off("resolve");
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
  static all(iterable=[]){
    let values = [];
    return new EmitterPromise((resolve, reject) => {
      for(let _p of iterable){
        _p.then(value => {
          values.push(value);
          if(values.length === iterable.length){
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
  static resolve(value){
    return new EmitterPromise((resolve) => {
      setTimeout(function(){
        resolve(value);
      }, 0);
    });
  }

  /**
   * 直接触发 reject
   * @param  {mixed} reason
   * @return {EmitterPromise}
   */
  static reject(reason){
    return new EmitterPromise((resolve, reject) => {
      setTimeout(function(){
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
  then(cb=()=>{}, _catch){
    this.on("resolve", (e, value) => {
      try{
        this.__chain_value = cb.call(null, this.__chain_value || value);
      } catch(e) {
        this.emit("reject", e);
      }
    });
    if(typeof _catch === "function"){
      this.catch(_catch);
    }
    return this;
  }

  /**
   * 当reject执行时触发
   * @param  {Function} cb 执行回调
   * @return {EmitterPromise}
   */
  catch(cb=()=>{}){
    this.on("reject", (e, reason) => {
      cb.call(null, reason);
    });
    return this;
  }
};

// 当支持原生promise的时候Promise替换成原生
Promise = EmitterPromise;
if("Promise" in window){
  Promise = window.Promise;
}

export default {
  observable,
  createSingleton,
  Promise
};