import * as trick from "./trick.es6.js";
import utils from "./utils.es6.js";
import {Loader} from "./loader.es6.js";
import {emitter} from "./emitter.es6.js";
import {Promise} from "./promise.es6.js";
import {riotjs} from "./adapter.es6.js";

const HC = class {

  /**
   * 设置
   * @param  {Object} config 
   * @return {null}        
   */
  static config(config = {}) {
    
    this.config = utils.assign({
      log: true,
      debug: true,
      // 非debug情况下出现js错误跳转页面地址
      errorPageUrl: null,
      // 上报错误地址,null不开启
      reportUrl: null,
      // 上报概率百分比
      reportChance: 1
    }, config);

    this.log(this.config.log);
  }

  /**
   * 视情况调用console
   * @param  {string}    type 消息类型
   * @param  {arguments} msg  
   * @return {null}         
   */
  static console(type, ...msg){
    if(this.config.debug === true 
      && typeof window.console !== "undefined"){
      window.console[type] && window.console[type](...msg);
    }
  }

  /**
   * 开启错误记录
   * @param  {Boolean} start
   * @return {null}
   */
  static log(start=true){
    let errors = [], msg, logger = emitter();
    window.onerror = () => { return true; };
    if(!start) return;
    window.addEventListener("error", (e) => {
      // 忽略跨域脚本错误
      if(e.message !== "Script error."){
        let _msg = `${e.filename} (${e.message}[${e.lineno}:${e.colno}])`;
        errors.push(_msg);
        this.console("error", _msg);
      }
      msg = errors.join("\n");
      logger.emit("error", msg);
      // 有跳转页面
      if(!this.config.debug && this.config.errorPageUrl){
        location.href = `${this.config.errorPageUrl}?from=${location.href}&msg=${msg}`;
      }
      // 抽样提交
      if(this.config.reportUrl && 
        Math.random()*100 >= (100-parseFloat(this.config.reportChance))){
        utils.xhr(this.config.reportUrl, {
          method: "POST", data: { message: msg }
        });
        this.console("info", "Error message reported.");
      }
      return true;
    }, false);
    return logger;
  }

};
HC.trick = trick;
HC.utils = utils;
HC.Loader = Loader;
HC.emitter = emitter;
HC.Promise = Promise;
HC.adapter = {
  riotjs: riotjs
};

export {
  HC
};