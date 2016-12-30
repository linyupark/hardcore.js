;(function(window, undefined) {

if('Promise' in window === false)
  throw new Error('Loader需要Promise支持.');

var Loader = function(){};


Loader.batch = function(){

  var
    // 准备加载的文件组
    files = arguments,
    // 准备加载的文件组
    files_ready = [],
    // 加载成功的文件组
    files_loaded = Loader._files_loaded || [],
    // 重名备份文件组
    files_backup = [],
    // 加载失败的文件组
    files_failed = [],
    // 获取文件名
    file_name = function(url){
      return url.split('/').pop();
    },
    // 获取文件后缀
    file_ext = function(url){
      return url.split('.').pop();
    }

  // 加载前的文件归类
  for (var i in files) {
    var exist = false;
    for (var j of files_ready) {
      if (file_name(files[i]) ===
        file_name(files_ready[j])) {
        exist = true;
        files_backup = files_backup.concat(files[i]);
      }
    }
    if (!exist)
      files_ready = files_ready.concat(files[i]);
  }

  return new Promise(function(resolve, reject){
    var load = function(){
      files_ready.forEach(function(file){
        var
          name = file_name(file),
          ext = file_ext(name).split("?")[0],
          attrs = [{ name: 'rel', value: 'file' }],
          type = { js: 'script', css: 'link' }[ext];
        if (ext === 'js')
          attrs.push({ name: 'defer', value: true });
        if(files_loaded.indexOf(file) !== -1){
          continue;
        }
        else{
          Loader.fetch(type, file, {
            attrs: attrs,
            success: function(){
              files_loaded.push(file);
              Loader._files_loaded = files_loaded;
            },
            error: function(){
              files_failed.push(file);
            }
          });
        }
      });
    }
  });

}

/**
 * 获取文件资源（单文件）
 * @param  {String} type    标签名称
 * @param  {String} url     文件地址
 * @param  {Object} options 设置配置
 * @return {Element}
 */
Loader.fetch = function(type, url, options){

  if(['script', 'link', 'img'].indexOf(type) === -1)
    throw new Error('支持动态加载的文件类型[script,link,img]');

  if(!url)
    throw new Error('请指定动态加载文件地址');

  var
    el = document.createElement(type),
    src = {
      script: "src",
      link: "href",
      img: "src"
    }[type],
    opts = {
      pos: 'head',
      attrs: [],
      success: function(){},
      error: function(){}
    };

  // 覆盖设置
  Object.keys(options).forEach(function(k){
    opts[k] = options[k];
  });

  // 扩展属性
  opts.attrs.forEach(function(attr){
    el[attr.name] = attr.value;
  });
  if (type === 'link') {
    el.rel = 'stylesheet';
  }

  el[src] = url;

  el.addEventListener('load', opts.success, false);
  el.addEventListener('error', opts.error, false);
  document[opts.pos].appendChild(el);

  return el;

}

if (typeof exports === 'object')
  module.exports = Loader
else if (typeof define === 'function' && define.amd)
  define(function() { return Loader })
else
  window.Loader = Loader

})(typeof window != 'undefined' ? window : undefined);
