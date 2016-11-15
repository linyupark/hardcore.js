import {
  loadFile, cacheJSON
} from "./utils.es6.js";
import trick from "./trick.es6.js";

export class Loader {

  /**
   * 支持加载的文件类型
   * @return {object}
   */
  static get types(){
    return {
      js: "script", css: "link"
    };
  }

  /**
   * 别名加载资源
   * @param  {string}    url   有资源信息的json文件地址
   * @param  {array} alias 别名组合
   * @return {promise}
   */
  static jsonDepend(url, alias=[]){
    let batches = [];
    return new trick.Promise((resolve, reject) => {
      cacheJSON(url, json => {
        for(const _name of alias){
          if(json[_name]){
            batches.push(json[_name]);
          }
        }
        this.batchDepend.apply(this, batches)
        .then(res => {
          resolve(res);
        })
        .catch(i => {
          reject(i);
        });
      });
    });
  }

  /**
   * 依赖载入
   * @param  {array} batches [前置资源,...],[后置,...]
   * @return {promise}
   */
  static batchDepend(...batches){
    if(batches.length < 2){
      return this.batch(batches);
    }
    return new trick.Promise((resolve, reject) => {
      let checker = (i) => {
        if(i < batches.length){
          this.batch(batches[i])
          .then(() => {
            checker(i+1);
          })
          .catch(i => {
            reject(i);
          });
        }
        else{
          resolve(batches);
        }
      };
      checker(0);
    });
  }

  /**
   * 并行载入
   * @param  {Array}  resource [资源,...]
   * @return {promise}
   */
  static batch(resource = []) {
    let promise_batch = [];
    for (const _res of resource) {
      promise_batch.push(new trick.Promise((resolve, reject) => {
        let ext = _res.split(".").pop(),
          attrs = {}, _i = resource.indexOf(_res);
        if (ext === "js") {
          attrs.defer = true;
        }
        if (!this.types[ext]) reject(_res, "文件格式不支持");
        else {
          loadFile(this.types[ext], _res, {
            attrs: attrs,
            success() {
              resolve(_res);
            },
            error() {
              reject(_i);
            }
          });
        }
      }));
    }
    return trick.Promise.all(promise_batch);
  }

}