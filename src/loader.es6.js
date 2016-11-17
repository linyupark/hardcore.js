import {
  loadFile, cacheJSON
} from "./utils.es6.js";
import {Promise} from "./promise.es6.js";
// import {emitter} from "./emitter.es6.js";

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
    let batches = [], backup_files = [];
    let replace_res = (file) => {
      // 查找备份资源
      let backup_file = false;
      for(const _f of backup_files){
        if(_f.split("/").pop() === file.name){
          backup_file = _f;
        }
      }
      if(!backup_file) return false;
      // 替换资源
      for(const _i in batches){
        for(const _j in batches[_i]){
          if(batches[_i][_j] === file.res){
            batches[_i][_j] = backup_file;
            backup_files.splice(backup_files.indexOf(backup_file), 1);
          }
        }
      }
      return batches;
    };

    cacheJSON(url, json => {
      let import_files;
      for(const _name of alias){
        if(!json[_name]) return;
        // 过滤重复的文件，将其放入备份
        import_files = [];
        for(const _f of json[_name]){
          let exist = false;
          for(const _ipf of import_files){
            if(_ipf.split("/").pop() === _f.split("/").pop()){
              exist = true;
              backup_files.push(_f);
            }
          }
          exist ||  import_files.push(_f);
        }
        batches.push(import_files);
      }
      return this.batchDepend.apply(this, batches)
      .catch(file => {
        replace_res(file);
        return batches;
      })
      .then(batches => {
        return this.batchDepend.apply(this, batches);
      });
    });
  }

  /**
   * 依赖载入
   * @param  {array} batches [前置资源,...],[后置,...]
   * @return {promise}
   */
  static batchDepend(...batches){
    let promise_list = [];
    if(batches.length < 2){
      return this.batch(batches);
    }
    for(const _i in batches){
      promise_list.push(this.batch(batches[_i]));
    }
    return Promise.all(promise_list);
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
              reject({
                res: _res,
                name: file
              });
            }
          });
        }
      }));
    }
    return Promise.all(promise_batch);
  }

}