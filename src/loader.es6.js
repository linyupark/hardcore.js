import { loadFile, removeFile } from "./utils.es6.js";
import { Promise } from "./promise.es6.js";

export class Loader {

  /**
   * 支持加载的文件类型
   * @return {object}
   */
  static get types() {
    return {
      js: "script",
      css: "link"
    };
  }

  /**
   * 资源别名载入（依赖模式）
   * @param {object} json json格式的资源
   * @param  {...[type]} alias_names [description]
   * @return {[type]}                [description]
   */
  static alias(json, alias_names = []) {
    let batch_list = [];
    for (const name of alias_names) {
      if (!json[name] || json[name].length === 0)
        continue;
      batch_list.push(json[name]);
    }
    return this.depend.apply(this, batch_list);
  }

  /**
   * 依赖载入
   * @param  {array} batch_list [前置资源,...],[后置,...]
   * @return {promise}
   */
  static depend(...batch_list) {
    let i = 0,
      fail = [],
      done = [],
      next = (resolve, reject) => {
        if (i === batch_list.length) {
          if (fail.length > 0) {
            reject(fail);
          } else resolve(done);
        }
        this.batch.apply(this, batch_list[i])
          .then(files => {
            done = done.concat(files);
            i++;
            next(resolve, reject);
          })
          .catch(files => {
            fail = fail.concat(files);
            i++;
            next(resolve, reject);
          });
      };
    return new Promise(next);
  }

  /**
   * 并行载入
   * @param  {arguments}  files 资源,...
   * @return {promise}
   */
  static batch(...files) {
    let load_files = [],
      backup_files = [],
      fail = [],
      done = [];
    // 已经通过loader加载过的文件
    this._loaded_files = this._loaded_files || [];
    // 收集重复文件，放入备份文件
    for (const f of files) {
      let exist = false;
      for (const lf of load_files) {
        if (f.split("/").pop() === lf.split("/").pop()) {
          exist = true;
          backup_files = backup_files.concat(f);
        }
      }
      if (!exist) load_files = load_files.concat(f);
    }
    return new Promise((resolve, reject) => {
      let load = () => {
          for (const file of load_files) {
            let name = file.split("/").pop(),
              ext = name.split(".").pop().split("?")[0],
              attrs = { rel: file },
              type = this.types[ext];
            if (ext === "js") attrs.defer = true;
            // 之前加载过的相同文件删除
            // removeFile(type, "head", file);
            if(this._loaded_files.indexOf(file) !== -1){
              check(done.push(file));
              continue;
            }
            loadFile(type, file, {
              attrs: attrs,
              success: () => {
                this._loaded_files.push(file);
                check(done.push(file));
              },
              error: () => {
                // 不留下失败文件
                removeFile(type, "head", file);
                check(fail.push(file));
              }
            });
          }
        },
        check = () => {
          if (done.length === load_files.length) {
            return resolve(done);
          }
          if (done.length + fail.length === load_files.length) {
            // 检查是否有备份，有则再尝试
            let exist = false;
            for (const fi in fail) {
              for (const bi in backup_files) {
                if (backup_files[bi].split("/").pop() ===
                  fail[fi].split("/").pop()) {
                  exist = true;
                  done = done.concat(backup_files[bi]);
                  backup_files.splice(bi, 1);
                }
              }
            }
            if (exist && done.length === load_files.length) {
              // 移除已经加载的文件
              for (const lf of load_files) {
                removeFile(this.types[lf.split(".").pop()], "head", lf);
              }
              // 替换成备份文件后能填补空缺就再执行一次
              load_files = done;
              done = [];
              fail = [];
              load();
            } else {
              reject(fail);
            }
          }
        };
      load();
    });
  }

}
