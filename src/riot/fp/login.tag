<fp-login>

  <header for="login"></header>

  <div class="body fp-login">

    <div class="wrapper">
      <div class="login-from">
        <p class="tab-line">
          <a href="javscript:;" class="{active: role=='admin'}"  onclick={fn.loginAdmin}>{app.lang.login.admin}</a>
          <a href="javscript:;" class="{active: role=='user'}"  onclick={fn.loginUser}>{app.lang.login.user}</a>
        </p>
        <p>
          <input type="text" ref="username" placeholder="{app.lang.login.placehoder.username}">
        </p>
        <p style="position: relative">
          <input type="password" ref="password" placeholder="{app.lang.login.placehoder.password}">
          <a href="javascript:;" onclick={fn.pwdToggle} class="pwd-{pwd}"></a>
        </p>
        <div class="msg-space">
          <input-valid for="username,password" rule="required" msg="请填写帐号密码"></input-valid>
        </div>
        <p class="btn-line">
          <button onclick={fn.login}>{app.lang.login.btn}</button>
          <br>
          <a href="#!/findpass">{app.lang.login.findpass}</a>
        </p>
      </div>
    </div>

  </div>

  <footer></footer>

  <script>
  var _this = this;
  _this.role = 'admin';
  _this.pwd = 'hide';
  _this.fn = {
    login: function(e){
      _this.tags['input-valid'].once('valid', function(target){
        // 尝试登录
        _this.app.api('POST', 'login/default/index', {
          data: {},
          trigger: e.target
        });
      });
      _this.tags['input-valid'].emit('check');
    },
    loginAdmin: function(){
      _this.role = 'admin';
    },
    loginUser: function(){
      _this.role = 'user';
    },
    // 切换密码显示隐藏
    pwdToggle: function(){
      _this.pwd = _this.pwd === 'hide' ? 'show' : 'hide';
      if(_this.pwd === 'hide'){
        _this.refs.password.type = 'password';
      }
      else{
        _this.refs.password.type = 'text';
      }
    }
  };
  _this.on('mount', function() {
    _this.app.log('login mounted');
  });
  </script>

</fp-login>
