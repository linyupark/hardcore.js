riot.tag2('raw', '', '', '', function(opts) {
  var _this = this;
  _this.fn = {};
  _this.on('mount', function(){
    _this.root.innerHTML = opts.content;
  });
});


riot.tag2('alert', '<p each="{m in message}" class="{center: message.length==1}"><i show="{type==\'error\'&&message.length==1}" class="icon-cancel"></i><i show="{type==\'success\'&&message.length==1}" class="icon-ok"></i><span>{m}</span></p>', 'alert .center,[data-is="alert"] .center{text-align: center;}', 'class="{type}"', function(opts) {
  var _this = this;
  _this.type = opts.type;
  _this.on('mount', function(){

  });
  _this.on('message', function(msg, type){
    var message = [];
    _this.root.style.display = 'block';
    if(typeof msg === 'object'){
      for(var k in msg){
        message.push(k+':'+msg[k]);
      }
    }
    else{
      message.push(msg);
    }
    clearTimeout(_this.timer);
    _this.timer = setTimeout(function(){
      _this.root.style.display = 'none';
      _this.update({
        message: null,
        type: null
      });
    }, 2900);
    _this.update({
      message: message,
      type: type ||'info'
    });
  });
});


riot.tag2('input-select', '<div class="input-select"><input ref="keyword" type="text" riot-value="{inputValue}" placeholder="{opts.placeholder}" onclick="{fn.pull}" onkeyup="{fn.keyup}" onblur="{fn.blur}" autocomplete="off"><ul ref="list" show="{items&&items.length > 0}"><li each="{item, i in items}" class="{active: i==selectIndex-1}" onclick="{fn.select}"> {item[parent.opts.name]} </li></ul></div>', 'input-select .input-select,[data-is="input-select"] .input-select{ display: inline-block; position: relative; } input-select .input-select ul,[data-is="input-select"] .input-select ul{ padding: 0; position: absolute; list-style: none; }', '', function(opts) {
  var _this = this;
  _this.selected = {};
  _this.selectIndex = 0;
  _this.inputValue = opts.value;

  _this.displayNum = opts.num || 6;
  _this.fn = {
    blur: function(e){
      setTimeout(function(){

        if(Object.keys(_this.selected).length === 0){
          clearTimeout(_this.timer);
          _this.update({
            selected: {},
            selectIndex: 0,
            items: []
          });
          _this.emit("select", _this.selected);
        }
      }, 200);
    },
    pull: function(e){
      e.target.value = '';
      _this.emit('pull', e.target.value);
    },
    select: function(e){

      if(e.item.item.id === -1) return;
      _this.selected = e.item.item;
      _this.refs.keyword.value = _this.selected[opts.name];
      _this.selectIndex = 0;
      _this.items = [];
      _this.emit("select", _this.selected);
    },
    keyup: function(e){
      clearTimeout(_this.timer);

      if(e.keyCode == 27){
        _this.fn.blur(e);
      }

      if(e.keyCode == 38 && _this.selectIndex > 0){
        if(_this.items.length-_this.displayNum+1 >= _this.selectIndex)
          _this.refs.list.scrollTop -= _this.refs.keyword.clientHeight-3;
        return _this.selectIndex--;
      }

      if(e.keyCode == 40 && _this.items && _this.selectIndex < _this.items.length){

        if(_this.displayNum <= _this.selectIndex)
          _this.refs.list.scrollTop += _this.refs.keyword.clientHeight-3;
        return _this.selectIndex++;
      }

      if(e.keyCode == 13 && _this.selectIndex > 0){
        _this.selected = _this.items[_this.selectIndex-1];
        if(_this.selected.id === -1) return;
        _this.refs.keyword.value = _this.selected[opts.name];
        _this.selectIndex = 0;
        delete _this.items;
        return _this.emit("select", _this.selected);
      }
      _this.timer = setTimeout(function(){
        _this.emit('pull', e.target.value);
      }, 500);
    }
  };
  _this.on('mount', function(){});
  _this.on('push', function(items){
    if(!items || items.length === 0){
      items = [{}];
      items[0][opts.name] = '没搜到请更换关键字';
      items[0].id = -1;
    }

    items.forEach(function(item, i){
      var name = item[opts.name];
      items.forEach(function(itemCheck, j){
        if(itemCheck[opts.name] == name){
          items[i][opts.name] = name+'(id:'+items[i][opts.id]+')';
        }
      });
    });

    _this.update({
      items: items,
      selected: {}
    });
  });
  _this.on('value', function(value){

    _this.refs.keyword.value = value;
  });
  _this.on('disable', function(){
    _this.refs.keyword.disabled = true;
  });
});


riot.tag2('modal', '<div if="{open}" class="modal-container {animation: open}" riot-style="width: {opts.w||360}px; height: {opts.h||200}px; z-index: {opts.z?Number(opts.z)+11:22}; top: {opts.top||\'30%\'}; margin-left: {opts.w?\'-\'+Number(opts.w/2):-180}px"><div class="header"><h3><yield from="title"></yield></h3><a href="javascript:;" onclick="{fn.close}"><i class="icon-cancel"></i></a></div><div class="content"><yield from="content"></yield></div><div class="btn-group"><yield from="button"></yield><button type="button" class="btn-gray" onclick="{fn.close}"><yield from="close"></yield></button></div></div><div if="{open}" onclick="{fn.close}" riot-style="opacity: {opts.mask}; z-index: {opts.z||11}" class="modal-mask"></div>', 'modal .modal-mask,[data-is="modal"] .modal-mask{ position: fixed; top: 0; left: 0; height: 100%; width: 100%; background: #000; opacity: .4; } modal .modal-container,[data-is="modal"] .modal-container{ position: fixed; left: 50%; box-shadow: 0 0 10px #666; background: #fff; border-radius: 5px; } modal .header,[data-is="modal"] .header{ height: 40px; border-bottom: 1px solid #ebebeb; position: relative; } modal .header h3,[data-is="modal"] .header h3{ text-align: center; line-height: 40px; height: 40px; padding: 0; margin: 0; } modal .header a,[data-is="modal"] .header a{ position: absolute; right: 15px; top: 13px; font-size: 14px; color: #ccc; } modal .header a:hover,[data-is="modal"] .header a:hover{ border: none } modal .content,[data-is="modal"] .content{ text-align: center; padding: 20px; min-height: 60px; } modal .btn-group,[data-is="modal"] .btn-group{ height: 50px; width: 100%; text-align: center; position: absolute; bottom: 0; } modal .btn-group button,[data-is="modal"] .btn-group button{ width: 90px; margin: 0 15px; } modal .animation,[data-is="modal"] .animation{ animation: fadeInDown .3s; }', '', function(opts) {
  var _this = this;
  _this.open = false;
  _this.fn = {
    close: function(){
      _this.update({
        open: false
      });
    }
  };
  _this.on('open', function(){

    _this.open = true;
    document.addEventListener('keydown', function(e){
      if(e.keyCode == 27) _this.fn.close();
    }, {once: true});
    _this.update();
  });
  _this.on('close', function(){
    _this.fn.close();
  });
});


riot.tag2('spinner-dot', '<div class="spinner" riot-style="margin-top: {opts.top||0}px"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>', 'spinner-dot .spinner,[data-is="spinner-dot"] .spinner{ width: 100%; text-align: center; } spinner-dot .spinner > div,[data-is="spinner-dot"] .spinner > div{ width: 14px; height: 14px; background-color: #ccc; border-radius: 100%; display: inline-block; -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both; animation: sk-bouncedelay 1.4s infinite ease-in-out both; } spinner-dot .spinner .bounce1,[data-is="spinner-dot"] .spinner .bounce1{ -webkit-animation-delay: -0.32s; animation-delay: -0.32s; } spinner-dot .spinner .bounce2,[data-is="spinner-dot"] .spinner .bounce2{ -webkit-animation-delay: -0.16s; animation-delay: -0.16s; } @-webkit-keyframes sk-bouncedelay { 0%, 80%, 100% { -webkit-transform: scale(0) } 40% { -webkit-transform: scale(1.0) } } @keyframes sk-bouncedelay { 0%, 80%, 100% { -webkit-transform: scale(0); transform: scale(0); } 40% { -webkit-transform: scale(1.0); transform: scale(1.0); } }', '', function(opts) {
});





riot.tag2('input-valid', '<span>{message}</span>', '', '', function(opts) {


  var _this = this;
  _this.fn = {
    focusFn: function(){
      _this.update({
        message: ''
      });
    },
    fetchValues: function(){
      _this.target = [];
      try{
        for(var i in opts.for.split(',')){
          _this.target[i] = _this.parent.refs[opts.for.split(',')[i]];
          if(_this.target[i] instanceof Array){
            _this.target[i] = _this.target[opts.index || 0];
          }
        }
        if(typeof _this.target[0] === 'undefined'){
          throw new Error();
        }
      }
      catch(e){
        return _this.update({
          message: '属性for所指定的校验对象没找到.'
        });
      }
      if(typeof _this.target[0] === 'undefined'){
        return _this.update({
          message: '属性for所指定的校验对象没找到.'
        });
      }

      if(!opts.rule && !opts.reg){
        return _this.update({
          message: '请指定校验规则，添加rule或reg属性.'
        });
      }

      for(var i in _this.target){
        if(_this.target[i] instanceof Array){
          _this.target[i].forEach(function(t){
            t.addEventListener('focus', _this.fn.focusFn, {once: true});
          });
        }
        else{
          _this.target[i].addEventListener('focus', _this.fn.focusFn, {once: true});
        }
      }
    }
  };

  this.on('mount', function(){});

  _this.on('check', function(){

    _this.invalid = false;
    _this.fn.fetchValues();
    if(!opts.rule) opts.rule = '';

    if(opts.rule.split(',').indexOf('required') !== -1){

      for(var i in _this.target){

        if(_this.target[i].value.replace(/\s/g, '') === '')
          _this.invalid = true;
      }
    }

    if(!_this.invalid && opts.rule.split(',').indexOf('number') !== -1){

      for(var i in _this.target){
        if(Number(_this.target[i].value) != _this.target[i].value)
          _this.invalid = true;
      }
    }

    if(!_this.invalid && opts.rule.split(',').indexOf('+int') !== -1){

      for(var i in _this.target){
        if(parseInt(_this.target[i].value, 10) < 1)
          _this.invalid = true;
      }
    }

    if(!_this.invalid && opts.rule.split(',').indexOf('email') !== -1){

      for(var i in _this.target){
        if(/[^@]+@[^@]+\.[^@]+/.test(_this.target[i].value) === false)
          _this.invalid = true;
      }
    }

    if(!_this.invalid && opts.reg){
      var reg = new RegExp(opts.reg, opts.flag);
      for(var i in _this.target){

        _this.invalid = reg.test(_this.target[i].value) === false;
      }
    }
    if(_this.invalid){
      _this.emit('invalid', _this.target);
      _this.update({
        message: opts.msg
      });
    }
    else{
      _this.emit('valid', _this.target);
    }
  });

  _this.on('msg', function(msg){
    _this.update({
      message: msg
    });
  });
});



riot.tag2('upload-formdata', '<input if="{!disable}" type="file" onchange="{fn.uploadOnChange}" name="{name}" ref="fileInput" multiple><button type="button" ref="btn" onclick="{fn.upload}" disabled="{disable}">{btnText}</button>', '', '', function(opts) {
    var _this = this;
    _this.name = opts.name || 'file';
    _this.btnText = opts.btn || '上传';
    _this.uploadFiles = [];
    _this.disable = opts.disable;
    _this.fn = {
      uploadOnChange: function(){
        if(opts.changeupload){

          _this.fn.upload(_this.refs.btn);
        }
      },
      upload: function(e) {
        _this.uploadFiles = _this.refs.fileInput.files;
        _this.progressList = [];
        if(!_this.uploadFiles.length){
          e.target.innerText = '请选择文件';
          return setTimeout(function(){
            e.target.innerText = _this.btnText;
          } ,1000);
        }
        var f = document.createElement('form');
        f.name = 'file';
        f.enctype = 'multipart/form-data';
        _this.fd = new FormData(f);
        for(var i=0; i < _this.uploadFiles.length; i++){
          _this.fd.append(_this.name, _this.uploadFiles[i]);
        }
        _this.emit('post', _this.fd);
      }
    };
    _this.on('mount', function(){

      if('FormData' in window === false){
        alert('Your browser not support FormData!');
      }
    });
    _this.on('setBtnText', function(text){
      _this.refs.btn.innerText = text;
    });
    _this.on('disable', function(flag){
      _this.disable = flag;
      _this.update();
    });
});





riot.tag2('pagination-number', '<ul class="pagination"><li show="{hasPrevPage}"><a href="javascript:;" onclick="{fn.jumpPage}">1</a></li><li show="{hasPrevPage}"><a href="javascript:;" onclick="{fn.prevPage}"> &lt; </a></li><li show="{hasPrevSpan}">...</li><li each="{p in prevPages}"><a href="javascript:;" onclick="{fn.jumpPage}">{p}</a></li><li class="active"><a href="javascript:;">{page}</a></li><li each="{p in nextPages}"><a href="javascript:;" onclick="{fn.jumpPage}">{p}</a></li><li show="{hasNextSpan}">...</li><li if="{hasNextPage}"><a href="javascript:;" onclick="{fn.nextPage}"> &gt; </a></li><li show="{hasNextPage}"><a href="javascript:;" onclick="{fn.jumpPage}">{pages}</a></li><li class="select" if="{opts.select==\'y\'}"> 跳转至 <span if="{pageList.length<100}"><select onchange="{fn.jumpPage}"><option each="{p in pageList}" riot-value="{p}" selected="{p==page}">{p}</option></select></span><input if="{pageList.length>=100}" onchange="{fn.jumpPage}" riot-value="{page}" type="{\'number\'}"> / {pages}页 </li></ul>', '', '', function(opts) {
  var _this = this;
  _this.pageSpan = 4;
  _this.pageList = [];
  _this.fn = {
    pageList: function() {
      _this.pageList = [];
      for(var page = 1; page <= _this.pages; page++){
        _this.pageList.push(page);
      }
    },
    prevPages: function() {
      var i = _this.pageSpan;
      _this.hasPrevSpan = (_this.page - _this.pageSpan) > 0;
      _this.prevPages = [];
      while(i--){
        if(_this.page - i > 1 && i > 0){
          _this.prevPages.push(_this.page - i);
        }
      }
      _this.update();
    },
    nextPages: function() {
      var i = 0;
      _this.hasNextSpan = (_this.page + _this.pageSpan) < _this.pages;
      _this.nextPages = [];
      while(++i < _this.pageSpan){
        if(_this.page + i < _this.pages){
          _this.nextPages.push(_this.page + i);
        }
      }
      _this.update();
    },

    jumpPage: function(e) {
      _this.fn.page(Number(
        e.item ? e.item.p :
        e.target.value || e.target.innerText
      ));
    },

    prevPage: function() {
      if(_this.hasPrevPage)
      _this.fn.page(_this.page - 1);
    },

    nextPage: function() {
      if(_this.hasNextPage)
      _this.fn.page(_this.page + 1);
    },
    pageCount: function(){
      _this.hasNextPage = _this.pages > _this.page;
      _this.hasPrevPage = _this.page > 1;
      _this.fn.prevPages();
      _this.fn.nextPages();
    },

    page: function(n) {
      _this.page = n;
      _this.fn.pageCount();
      _this.emit('change', n);
    },

    render: function(){
      _this.page = Number(opts.page || 1);
      _this.pages = Number(opts.pages || 1);
      _this.fn.pageList();
      _this.fn.pageCount();
      _this.update();
    }
  };
  _this.on('mount', function(){
    _this.fn.render();
  });
  _this.on('render', _this.fn.render);
});
