import utils from "./utils.es6.js";
import { emitter } from "./emitter.es6.js";
import { Promise } from "./promise.es6.js";
import route from "./riot.route.es6.js";

let __riot_subRoute;


const riotjs = class {

  static get router() {
    return route;
  }

  static subRoute(...args) {
    if (!__riot_subRoute)
      __riot_subRoute = this.router.create();
    return __riot_subRoute.apply(this, args);
  }

  // 浏览器编译
  static complie(url = []) {
    let promise_list = [];
    for (const _url of url) {
      promise_list.push(new Promise(resolve => {
        window.riot.compile(_url, () => resolve(_url));
      }));
    }
    return Promise.all(promise_list);
  }

  // route
  static route(base = "#!") {
    let em = emitter();
    this.router.base(base);
    this.router.parser(path => {
      const raw = path.split("?"),
        uri = raw[0].split("/"),
        qs = raw[1];
      if (qs) uri.push(utils.search2obj(qs));
      return uri;
    });
    this.router((...args) => {
      em.emit("change", args);
    });
    this.router.start(true);
    return em;
  }

};

export { riotjs };
