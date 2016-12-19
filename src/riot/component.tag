

<!-- 警示信息 -->
<alert class="{type}">
  <style scoped>
  .center{text-align: center;}
  </style>
  <p each={m in message} class="{center: message.length==1}">
    <i show={type=='error'&&message.length==1} class="icon-cancel"></i>
    <i show={type=='success'&&message.length==1} class="icon-ok"></i>
    <span>{m}</span>
  </p>
  <script>
  var _this = this;
  _this.type = opts.type;
  _this.on('mount', function(){
    // console.log('alert mounted');
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
  </script>
</alert>

<!-- 输入下拉框 -->
<input-select>
  <style scoped>
  .input-select{
    display: inline-block;
    position: relative;
  }
  .input-select ul{
    padding: 0;
    position: absolute;
    list-style: none;
  }
  </style>
  <div class="input-select">
    <input ref="keyword" type="text"
      value="{inputValue}"
      placeholder="{opts.placeholder}"
      onclick={fn.pull}
      onkeyup={fn.keyup}
      onblur={fn.blur}>
    <ul if={items&&items.length > 0}>
      <li each={item, i in items} class="{active: i==selectIndex-1}" onclick={fn.select}>
        {item[parent.opts.name]}
      </li>
    </ul>
  </div>

  <script>
  var _this = this;
  _this.selected = {};
  _this.selectIndex = 0;
  _this.inputValue = opts.value;
  _this.fn = {
    blur: function(e){
      setTimeout(function(){
        // 失去焦点时候如果输入框内的数据不是下拉框中的，则清空数据
        if(Object.keys(_this.selected).length === 0){
          clearTimeout(_this.timer);
          _this.selected = {};
          _this.selectIndex = 0;
          e.target.value = '';
          delete _this.items;
          _this.emit("select", _this.selected);
          _this.update();
        }
      }, 500);
    },
    pull: function(e){
      e.target.value = '';
      _this.emit('pull', e.target.value);
    },
    select: function(e){
      // 如果id为-1则不选中
      if(e.item.item.id === -1) return;
      _this.selected = e.item.item;
      _this.refs.keyword.value = _this.selected[opts.name];
      _this.selectIndex = 0;
      delete _this.items;
      _this.emit("select", _this.selected);
    },
    keyup: function(e){
      clearTimeout(_this.timer);
      // 上
      if(e.keyCode == 38 && _this.selectIndex > 0){
        return _this.selectIndex--;
      }
      // 下
      if(e.keyCode == 40 && _this.items && _this.selectIndex < _this.items.length){
        return _this.selectIndex++;
      }
      // 回车
      if(e.keyCode == 13 && _this.selectIndex > 0){
        _this.selected = _this.items[_this.selectIndex-1];
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
    // 查询到数据渲染到下拉表中
    _this.update({
      items: items,
      selected: {}
    });
  });
  _this.on('value', function(value){
    // 更新value显示数据
    _this.update({
      inputValue: value
    });
  });
  _this.on('disable', function(){
    _this.refs.keyword.disabled = true;
  });
  </script>
</input-select>

<!-- 弹出框 -->
<modal show="{open}">
  <style scoped>
  .modal-mask{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #000;
    opacity: .4;
  }
  .modal-container{
    position: fixed;
    left: 50%;
    box-shadow: 0 0 10px #666;
    background: #fff;
    border-radius: 5px;
  }
  .header{
    height: 40px;
    border-bottom: 1px solid #ebebeb;
    position: relative;
  }
  .header h3{
    text-align: center;
    line-height: 40px;
    height: 40px;
    padding: 0;
    margin: 0;
  }
  .header a{
    position: absolute;
    right: 15px;
    top: 13px;
    font-size: 14px;
    color: #ccc;
  }.header a:hover{ border: none }
  .content{
    text-align: center;
    padding: 20px;
    min-height: 60px;
  }
  .btn-group{
    height: 50px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
  }
  .btn-group button{
    width: 90px;
    margin: 0 15px;
  }
  .animation{
    animation: fadeInDown .3s;
  }
  </style>

  <!-- 弹窗主体 -->
  <div class="modal-container {animation: open}"
    style="width: {opts.w||360}px; height: {opts.h||200}px; z-index: {opts.z?Number(opts.z)+11:22}; top: {opts.top||'30%'}; margin-left: {opts.w?'-'+Number(opts.w/2):-180}px">
    <div class="header">
      <h3><yield from="title"/></h3>
      <a href="javascript:;" onclick={fn.close}><i class="icon-cancel"></i></a>
    </div>
    <div class="content">
      <yield from="content"/>
    </div>
    <div class="btn-group">
      <yield from="button"/>
      <button type="button" class="btn-gray" onclick={fn.close}>
        <yield from="close"/>
      </button>
    </div>
  </div>

  <!-- 遮罩层 -->
  <div onclick={fn.close}
    style="opacity: {opts.mask}; z-index: {opts.z||11}"
    class="modal-mask"></div>

  <script>
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
  </script>
</modal>

<!-- ...loading 效果  -->
<spinner-dot>
  <style scoped>
  .spinner {
    width: 100%;
    text-align: center;
    }
    .spinner > div {
      width: 14px;
      height: 14px;
      background-color: #666;
      border-radius: 100%;
      display: inline-block;
      -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
      animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }

    .spinner .bounce1 {
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }

    .spinner .bounce2 {
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
    }

    @-webkit-keyframes sk-bouncedelay {
      0%, 80%, 100% { -webkit-transform: scale(0) }
      40% { -webkit-transform: scale(1.0) }
    }

    @keyframes sk-bouncedelay {
      0%, 80%, 100% {
        -webkit-transform: scale(0);
        transform: scale(0);
      } 40% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
      }
    }
  </style>
  <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</spinner-dot>




<!-- 输入内容校验 -->
<input-valid>

  <span>{message}</span>

  <script>
  // <input-valid
  //   for='检查目标1,检查目标2...'
  //   index='如果有同名的设置检测第几个，默认为0'
  //   rule='一些校验规则用, 分隔'
  //   reg='正则规则' flag='正则的flag'
  //   msg='如果不符合的报错信息'>
  var _this = this, target = [], invalid;

  this.on('mount', function(){

    try{
      for(var i in opts.for.split(',')){
        target[i] = _this.parent.refs[opts.for.split(',')[i]];
        if(target[i] instanceof Array){
          target[i] = target[opts.index || 0];
        }
      }
      if(typeof target[0] === 'undefined'){
        throw new Error();
      }
    }
    catch(e){
      return _this.update({
        message: '属性for所指定的校验对象没找到.'
      });
    }

    if(typeof target[0] === 'undefined'){
      return _this.update({
        message: '属性for所指定的校验对象没找到.'
      });
    }

    if(!opts.rule && !opts.reg){
      return _this.update({
        message: '请指定校验规则，添加rule或reg属性.'
      });
    }

    // 改变值得时候清空校验结果信息
    var focusFn = function(){
      _this.update({
        message: ''
      });
    };
    for(var i in target){
      if(target[i] instanceof Array){
        target[i].forEach(function(t){
          t.addEventListener('focus', focusFn, false);
        });
      }
      else{
        target[i].addEventListener('focus', focusFn, false);
      }
    }
  });

  _this.on('check', function(){

    invalid = false;

    // 必填
    if(opts.rule.split(',').indexOf('required') !== -1){
      // console.log('check required');
      for(var i in target){
        if(target[i].value.replace(/\s/g, '') === '') invalid = true;
      }
    }
    // 数字
    if(!invalid && opts.rule.split(',').indexOf('number') !== -1){
      // console.log('check number');
      for(var i in target){
        if(Number(target[i].value) != target[i].value) invalid = true;
      }
    }
    // 正整数
    if(!invalid && opts.rule.split(',').indexOf('+int') !== -1){
      // console.log('check +int');
      for(var i in target){
        if(parseInt(target[i].value, 10) < 1) invalid = true;
      }
    }
    // 邮箱
    if(!invalid && opts.rule.split(',').indexOf('email') !== -1){
      // console.log('email +int');
      for(var i in target){
        if(/[^@]+@[^@]+\.[^@]+/.test(target[i].value) === false) invalid = true;
      }
    }
    // 正则
    if(!invalid && opts.reg){
      var reg = new RegExp(opts.reg, opts.flag);
      for(var i in target){
        invalid = reg.test(target[i].value) === false;
      }
    }
    if(invalid){
      _this.emit('invalid', target);
      _this.update({
        message: opts.msg
      });
    }
    else{
      _this.emit('valid', target);
    }
  });

  _this.on('msg', function(msg){
    _this.update({
      message: msg
    });
  });
  </script>
</input-valid>


<!-- 利用FormData上传数据流 -->
<upload-formdata>
  <input type="file" onchange={fn.uploadOnChange} name={name} ref="fileInput" multiple>
  <button type="button" ref="btn" onclick={fn.upload} disabled="{opts.disable}">{btnText}</button>
  <script>
    var _this = this;
    _this.name = opts.name || 'file';
    _this.btnText = opts.btn || '上传';
    _this.uploadFiles = [];
    _this.fn = {
      uploadOnChange: function(){
        if(opts.changeupload){
          console.log(_this.refs.btn)
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
      // 浏览器支持检测
      if('FormData' in window === false){
        alert('Your browser not support FormData!');
      }
    });
    _this.on('setBtnText', function(text){
      _this.refs.btn.innerText = text;
    });
  </script>
</upload-formdata>

<!-- <upload-base64>

  <div class="progress" each={progressList}>
    <div class="determinate" ref={name} style="width: {progress||0}%"></div>
  </div>

  <input type="file" name={opts.type} ref="fileInput" multiple>
  <button class="btn" onclick={fn.upload}>上传</button>

  <script>
  var _this = this;
  _this.on('mount', function() {
    // 浏览器支持检测
    if('FileReader' in window === false){
      alert('Your browser not support FileReader!');
    }
    _this.uploadFiles = [];
  });

  _this.fn = {
    upload: function(e) {
      _this.uploadFiles = _this.refs.fileInput.files;
      _this.progressList = [];
      if(!_this.uploadFiles.length){
        e.target.innerText = '请选择文件';
        return setTimeout(function(){
          e.target.innerText = '上传';
        } ,1000);
      }
      for(var i in _this.uploadFiles){
        if(i === 'length') continue;
        var fileReader = new FileReader();
        fileReader.addEventListener('load', function(e) {
          _this.emit('base64::loaded', {
            base64: e.target.result,
            name: _this.uploadFiles[i].name
          });
        }, { once: true });
        fileReader.readAsDataURL(_this.uploadFiles[i]);
      }
    }
  };

  _this.on('base64::loaded', function(data) {
    _this.progressList.push({
      name: data.name,
      progress: 0
    });
    _this.app.xhr('//192.168.1.161/upload.php', {
      data: { file: data.base64 },
      method: 'POST'
    }).complete(function() {
      _this.app.log('file' + data.name + 'completed.');
    }).progress(function(per) {
      for(var i in _this.progressList){
        if(_this.progressList[i].name == data.name){
          _this.progressList[i].progress = per;
          _this.update();
        }
      }
    });
  });
  </script>

</upload-base64> -->



<pagination-number>

  <ul class="pagination">
    <li if={hasPrevPage}>
      <a href="javascript:;" onclick={fn.jumpPage}>1</a>
    </li>
    <li if={hasPrevPage}>
      <a href="javascript:;" onclick={fn.prevPage}>
        &lt;
      </a>
    </li>
    <li if={hasPrevSpan}>...</li>
    <li each={p in prevPages}>
      <a href="javascript:;" onclick={fn.jumpPage}>{p}</a>
    </li>
    <li class="active">
      <a href="javascript:;">{page}</a>
    </li>
    <li each={p in nextPages}>
      <a href="javascript:;" onclick={fn.jumpPage}>{p}</a>
    </li>
    <li if={hasNextSpan}>...</li>
    <li if={hasNextPage}>
      <a href="javascript:;" onclick={fn.nextPage}>
        &gt;
      </a>
    </li>
    <li if={hasNextPage}>
      <a href="javascript:;" onclick={fn.jumpPage}>{pages}</a>
    </li>
    <li class="select" if={opts.select=='y'}>
      跳转至
      <select onchange="{fn.jumpPage}">
        <option each="{p in pageList}" value="{p}" selected="{p==page}">{p}</option>
      </select> / {pages}页
    </li>
  </ul>
  <script>
  var _this = this;
  _this.pageSpan = 4;
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
    // 跳转页
    jumpPage: function(e) {
      _this.fn.page(Number(
        e.item ? e.item.p :
        e.target.value || e.target.innerText
      ));
    },
    // 上一页
    prevPage: function() {
      if(_this.hasPrevPage)
      _this.fn.page(_this.page - 1);
    },
    // 下一页
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
    // 切换页面
    page: function(n) {
      _this.page = n;
      _this.fn.pageCount();
      _this.emit('change', n);
    },
    // 渲染
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
  </script>

</pagination-number>
