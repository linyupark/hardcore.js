import utils from "./utils.es6.js";
import {emitter} from "./emitter.es6.js";
import {Promise} from "./promise.es6.js";

const riotjs = class {

  // 浏览器编译
  static complie(url=[]){
    let promise_list = [];
    if(url.length === 0 || typeof window.riot === "undefined") 
      throw new Error("url未设置或riot未加载");
    for(const _url of url){
      promise_list.push(new Promise(resolve => {
        try{
          window.riot.compile(_url, () => resolve(_url));
        } catch(e) {
          throw e;
        }
      }));
    }
    return Promise.all(promise_list);
  }

  // 全局route
  static defaultRoute(base="#!"){
    let em;
    if(window.riot === "undefined") 
      throw new Error("riot未加载");
    em = emitter();
    window.riot.route.base(base);
    window.riot.route.parser(function(path) {
      const raw = path.split("?"),
          uri = raw[0].split("/"),
          qs = raw[1];
      if(qs) uri.push(utils.search2obj(qs));
      return uri;
    });
    window.riot.route((...args) => {
      em.emit("change", args);
    });
    window.riot.route.start(true);
    return em;
  }

};

export {riotjs};