riot.tag2('fp-500', '<header for="user"></header><main class="user"><div class="container" style="text-align: center; padding: 40px 0"><img width="50%" src="static/img/fp/404.png"><br><br><br><h2>哎呀！页面出错拉。</h2><p> {msg} </p><p><a class="under-line" href="javscript:;" onclick="{fn.back}">回到上一页</a></p></div></main>', 'fp-500 .user .container img,[data-is="fp-500"] .user .container img{ animation: fadeInDown 1s; }', '', function(opts) {
  var _this = this;
  _this.fn = {
    back: function(){
      history.back();
    }
  };
  _this.on('mount', function(){
    _this.msg = _this.app.route.query.message;
    _this.update();
  });
});
