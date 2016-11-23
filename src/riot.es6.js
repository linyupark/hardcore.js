import utils from "./utils.es6.js";
import {emitter} from "./emitter.es6.js";
import {Promise} from "./promise.es6.js";

let __riot_subRoute;

const riotjs = class {

  static get router(){
    return (window.riot && window.riot.route) || window.route;
  }

  static subRoute(...args){
    if(!__riot_subRoute)
      __riot_subRoute = this.router.create();
    return __riot_subRoute.apply(this, args);
  }

  // 浏览器编译
  static complie(url=[]){
    let promise_list = [];
    if(url.length === 0 || typeof window.riot === "undefined")
      throw new Error("url未设置或riot未加载");
    for(const _url of url){
      promise_list.push(new Promise(resolve => {
        window.riot.compile(_url, () => resolve(_url));
      }));
    }
    return Promise.all(promise_list);
  }

  // route
  static route(base="#!"){
    let em, route = this.router;
    // 针对 riot3.0 route分离
    if(typeof route === "undefined")
      throw new Error("riot未加载");
    em = emitter();
    route.base(base);
    route.parser(function(path) {
      const raw = path.split("?"),
          uri = raw[0].split("/"),
          qs = raw[1];
      if(qs) uri.push(utils.search2obj(qs));
      return uri;
    });
    route((...args) => {
      em.emit("change", args);
    });
    route.start(true);
    return em;
  }

  //

};

export {riotjs};
