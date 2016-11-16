import {
  loadFile, cacheJSON
} from "./utils.es6.js";
import {Promise} from "./promise.es6.js";

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
    return new Promise((resolve, reject) => {
      cacheJSON(url, json => {
        for(const _name of alias){
          if(json[_name]){
            batches.push(json[_name]);
          }
        }
        this.batchDepend.apply(this, batches)
        .then(files => {
          resolve(files);
        })
        .catch(file => {
          reject(file);
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
    return new Promise((resolve, reject) => {
      let checker = (i, files=[]) => {
        if(i < batches.length){
          this.batch(batches[i])
          .then(file => {
            files = files.concat(file);
            checker(i+1, files);
          })
          .catch(file => {
            reject(file);
          });
        }
        else{
          resolve(files);
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
      promise_batch.push(new Promise((resolve, reject) => {
        let ext = _res.split(".").pop(),
          attrs = {}, file = _res.split("/").pop();
        if (ext === "js") {
          attrs.defer = true;
        }
        if (!this.types[ext]) reject(_res, "文件格式不支持");
        else {
          loadFile(this.types[ext], _res, {
            attrs: attrs,
            success() {
              resolve(file);
            },
            error() {
              reject(file);
            }
          });
        }
      }));
    }
    return Promise.all(promise_batch);
  }

}