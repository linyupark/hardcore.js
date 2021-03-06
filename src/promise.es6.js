import { emitter } from "./emitter.es6.js";

/**
 * 模拟标准Promise类
 */
let Promise;
let EmitterPromise = class {

  constructor(rr = () => {}) {
    if (rr.length === 0) {
      throw new Error("Promise needs (resolve, reject) at least one function name.");
    }
    emitter(this);
    this._resolve = (value) => {
      setTimeout(() => {
        this.emit("resolve", value);
        this._emited_value = value;
        this.off("reject");
      }, 0);
    };
    if (rr.length === 1) {
      rr.call(this, this._resolve);
    } else {
      this._reject = (reason) => {
        setTimeout(() => {
          this.emit("reject", reason);
          this.off("resolve");
        }, 0);
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
  static all(iterable = []) {
    let values = [];
    return new EmitterPromise((resolve, reject) => {
      for (let _p of iterable) {
        _p.then(value => {
          values.push(value);
          if (values.length === iterable.length) {
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
  static resolve(value) {
    if (value instanceof Promise) {
      return value;
    }
    return new EmitterPromise((resolve) => {
      setTimeout(function() {
        resolve(value);
      }, 0);
    });
  }

  /**
   * 直接触发 reject
   * @param  {mixed} reason
   * @return {EmitterPromise}
   */
  static reject(reason) {
    return new EmitterPromise((resolve, reject) => {
      setTimeout(function() {
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
  then(cb = () => {}, _catch) {
    this.once("resolve", value => {
      try {
        if (this.__chain_value instanceof Promise) {
          this.__chain_value.then(cb);
          return;
        }
        this.__chain_value = cb.call(null, this.__chain_value || value);
      } catch (e) {
        this.emit("reject", e);
      }
    });
    if (typeof _catch === "function") {
      return this.catch(_catch);
    }
    if(this._emited_value){
      this.emit("resolve", this._emited_value);
    }
    return this;
  }

  /**
   * 当reject执行时触发
   * @param  {Function} cb 执行回调
   * @return {EmitterPromise}
   */
  catch (cb = () => {}) {
    this.once("reject", reason => {
      let result;
      try {
        if (this.__no_throw) return;
        result = cb.call(null, reason);
        this.__no_throw = true;
        if (result) this.emit("resolve", result);
      } catch (e) {
        this.emit("reject", e);
        if (!this.__no_throw) {
          throw e;
        }
      }
    });
    return this;
  }
};

// 当支持原生promise的时候Promise替换成原生
Promise = EmitterPromise;
// if ("Promise" in window) {
//   Promise = window.Promise;
// }

export { Promise };
