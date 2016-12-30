// 需要预先加载 emitter
;
(function(window, undefined) {

  var EmitterPromise = function(rr) {
    if (typeof rr !== 'function' || rr.length === 0) {
      throw new Error('Promise匿名函数中resolve不可缺少.');
    }
    var _this = emitter(this);
    _this._resolve = function(v) {
      setTimeout(function() {
        _this.emit('resolve', v);
        _this._emitted_value = v;
        _this.off('reject');
      }, 0);
    }
    if (rr.length === 1) {
      rr.call(_this, _this._resolve);
    } else {
      _this._reject = function(reason) {
        setTimeout(function() {
          _this.emit('reject', reason);
          _this.off('resolve');
        }, 0);
      }
      rr.call(_this, _this._resolve, _this._reject);
    }
    return _this;
  }

  /**
   * Promise.all
   * @param  {Array}  iterable [p1,p2,p3..]
   * @return {Promise}
   */
  EmitterPromise.all = function(iterable) {
    var
      iterable = iterable || [],
      values = [];
    return new EmitterPromise(function(resolve, reject) {
      for (var i in iterable) {
        iterable[i].then(function(v) {
          values.push(v);
          if (values.length === iterable.length) {
            resolve(values);
          }
        }).catch(function(reason) {
          reject(reason);
        });
      }
    });
  }

  /**
   * Promise.resolve
   * @param  {mixed} v
   * @return {Promise}
   */
  EmitterPromise.resolve = function(v) {
    if (v instanceof EmitterPromise) {
      return v;
    }
    return new EmitterPromise(function(resolve) {
      setTimeout(function() {
        resolve(v);
      }, 0);
    });
  }

  /**
   * Promise.reject
   * @param  {String} reason 原因
   * @return {Promise}
   */
  EmitterPromise.reject = function(reason) {
    return new EmitterPromise(function(resolve, reject){
      setTimeout(function() {
        reject(reason);
      }, 0);
    });
  }

  /**
   * 当resolve执行时触发
   * @param  {Function} cb 执行回调
   * @return {EmitterPromise}
   */
  EmitterPromise.prototype.then = function(cb, _catch) {
    var _this = this, cb = cb || function(){};
    _this.once('resolve', function(v){
      try {
        if (_this._chain instanceof EmitterPromise) {
          _this._chain.then(cb);
          return;
        }
        _this._chain = cb.call(null, _this._chain || v);
      } catch (e) {
        _this.emit('reject', e);
      }
    });
    if (typeof _catch === "function") {
      return _this.catch(_catch);
    }
    if(_this._emitted_value){
      _this.emit('resolve', _this._emitted_value);
    }
    return _this;
  }

  /**
   * 当reject执行时触发
   * @param  {Function} cb 执行回调
   * @return {EmitterPromise}
   */
  EmitterPromise.prototype.catch = function(cb) {
    var _this = this, cb = cb || function(){};
    _this.once('reject', function(reason){
      var result;
      try {
        if (_this._no_throw) return;
        result = cb.call(null, reason);
        _this._no_throw = true;
        if (result) _this.emit('resolve', result);
      } catch (e) {
        _this.emit('reject', e);
        if (!_this._no_throw) {
          throw e;
        }
      }
    });
    return _this;
  }

  if (typeof exports === 'object')
    module.exports = EmitterPromise
  else if (typeof define === 'function' && define.amd)
    define(function() { return EmitterPromise })
  else
    window.EmitterPromise = EmitterPromise

})(typeof window != 'undefined' ? window : undefined);
