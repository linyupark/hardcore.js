<fp-index>

  <h1>FP index</h1>

  <p>
    这个页面用来根据用户信息进行跳转操作
    未登录 : login
    捐赠者 : user-index
    管理员 : admin-index
    <a href="#!login">login</a>
    <a href="#!user-index">user</a>
  </p>

  <upload-formdata name="file[]"></upload-formdata>

  <script>
  var _this = this;
  _this.on('mount', function(){
    _this.tags['upload-formdata'].on('post', function(fd){
      _this.app.api('POST', 'agreement/default/upload-file', {
        payload: true,
        showProgress: true,
        formdata: true,
        data: fd
      }).on('done', function(data){
        console.log(data);
      })
      .on('progress', function(percent){
        _this.app.log(percent);
      });
    });
  });

  </script>

</fp-index>
