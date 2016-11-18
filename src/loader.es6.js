import {
  loadFile, cacheJSON
} from "./utils.es6.js";
import {emitter} from "./emitter.es6.js";

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
    let batches = [], backup_files = [], em = emitter();
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

    em.on("batches::ready", () => {
      this.batchDepend.apply(this, batches)
      .once("fail", (e, file, name) => {
        replace_res({res: file, name: name}) && em.emit("batches::ready");
      });
    });

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
      em.emit("batches::ready");
    });
    return em;
  }

  /**
   * 依赖载入
   * @param  {array} batches [前置资源,...],[后置,...]
   * @return {promise}
   */
  static batchDepend(...batches){
    let next_times = 0, loaded_files = [], em = emitter(),
    load_batch = () => {
      this.batch(batches[next_times])
      .on("done", (e, resource) => {
        next_times++;
        em.emit("next", next_times, resource);
      })
      .on("fail", (e, file, name) => {
        em.emit("fail", file, name);
      });
    };

    if(batches.length < 2){
      return this.batch(batches);
    }

    em.on("next", (e, times, files) => {
      loaded_files = loaded_files.concat(files);
      times === batches.length && 
      em.emit("done", loaded_files) || load_batch();
    });

    load_batch();
    
    return em;
  }

  /**
   * 并行载入
   * @param  {Array}  resource [资源,...]
   * @return {promise}
   */
  static batch(resource = []) {
    let em = emitter(), res = resource;
    let load = (i) => {
      const file = resource[i];
      let ext = file.split(".").pop(), attrs = {}, 
        name = file.split("/").pop();
      if (ext === "js") {
        attrs.defer = true;
      }
      
      if (!this.types[ext]) 
        return em.emit("fail", file, name);

      loadFile(this.types[ext], file, {
        attrs: attrs,
        success() {
          i++;
          if(i < res.length){
            return load(i);
          }
          em.emit("done", res);
        },
        error() { em.emit("fail", file, name); }
      });

    };
    load(0);
    return em;
  }

}