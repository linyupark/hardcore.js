
<input-valid>

  <span show={message}>{message}</span>

  <script>
  // <input-valid
  //   for='检查目标1,检查目标2...'
  //   index='如果有同名的设置检测第几个，默认为0'
  //   rule='一些校验规则用, 分隔'
  //   reg='正则规则' flag='正则的flag'
  //   msg='如果不符合的报错信息'>
  var _this = this, target = [], invalid = false;

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
    for(var i in target){
      target[i].addEventListener('focus', function(){
        _this.update({
          message: ''
        })
      }, false);
    }
  });

  _this.on('check', function(){
    // 必填
    if(opts.rule.split(',').indexOf('required') !== -1){
      for(var i in target){
        invalid = target[i].value.replace(/\s/g, '') === '';
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
      return _this.update({
        message: opts.msg
      });
    }
  });
  </script>
</input-valid>



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
    <li show={hasPrevPage}>
      <a href="javascript:;" onclick={fn.jumpPage}>1</a>
    </li>
    <li show={hasPrevPage}>
      <a href="javascript:;" onclick={fn.prevPage}>
        &lt;
      </a>
    </li>
    <li show={hasPrevSpan}>...</li>
    <li each={p in prevPages}>
      <a href="javascript:;" onclick={fn.jumpPage}>{p}</a>
    </li>
    <li class="active">
      <a href="javascript:;">{page}</a>
    </li>
    <li each={p in nextPages}>
      <a href="javascript:;" onclick={fn.jumpPage}>{p}</a>
    </li>
    <li show={hasNextSpan}>...</li>
    <li show={hasNextPage}>
      <a href="javascript:;" onclick={fn.nextPage}>
        &gt;
      </a>
    </li>
    <li show={hasNextPage}>
      <a href="javascript:;" onclick={fn.jumpPage}>{pages}</a>
    </li>
    <li show={opts.select=='y'}>
      第
      <select onchange={fn.jumpPage} value="{page}">
        <option each={p in pageList} value="{p}">{p}</option>
      </select>
      页
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
    // 切换页面
    page: function(n) {
      _this.page = n;
      _this.hasNextPage = _this.pages > _this.page;
      _this.hasPrevPage = _this.page > 1;
      _this.fn.prevPages();
      _this.fn.nextPages();
      _this.emit('page', n);
    }
  };

  _this.on('mount', function() {
    _this.page = Number(opts.page || 1);
    _this.pages = Number(opts.pages);
    _this.fn.pageList();
    _this.fn.page(_this.page);
    _this.update();
  });
  </script>

</pagination-number>

<!-- <pagination-select>

  <ul class="pagination">
    <li>
      <a href="javascript:;" class="{'disabled': !hasPrevPage}" onclick={fn.prevPage}>
        上页
      </a>
    </li>
    <li>
      <select onchange={fn.jumpPage} value="{page}">
        <option each={p in pageList} value="{p}">{p}</option>
      </select>
    </li>
    <li>
      <a href="javascript:;" class="{'disabled': !hasNextPage}" onclick={fn.nextPage}>
        下页
      </a>
    </li>
  </ul>
  <script>
  var _this = this;
  _this.fn = {
    // 循环总页数生成option选项
    pageList: function() {
      _this.pageList = [];
      for(var page = 1; page <= _this.pages; page++){
        _this.pageList.push(page);
      }
    },
    // 跳转页
    jumpPage: function(e) {
      _this.fn.page(Number(e.target.value));
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
    // 切换页面
    page: function(n) {
      _this.page = n;
      _this.hasNextPage = _this.pages > _this.page;
      _this.hasPrevPage = _this.page > 1;
      _this.emit('page', n);
    }
  };

  _this.on('mount', function() {
    _this.page = Number(opts.page);
    _this.pages = Number(opts.pages);
    _this.fn.pageList();
    _this.fn.page(_this.page);
    _this.update();
  });
  </script>

</pagination-select> -->
