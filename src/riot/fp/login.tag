<fp-login>

  <header for="login"></header>

  <div class="body fp-login">

    <div class="wrapper">
      <form class="login-from" onsubmit="return false">
        <p class="tab-line">
          <a href="javascript:;" class="{active: role=='admin'}" onclick={fn.loginAdmin}>{app.lang.login.admin}</a>
          <a href="javascript:;" class="{active: role=='user'}"
            onclick={fn.loginUser}>{app.lang.login.user}</a>
        </p>
        <p>
          <input type="text" ref="username" onclick="this.select()"  placeholder="{app.lang.login.placehoder.username}">
        </p>
        <p style="position: relative">
          <input type="password" ref="password" onclick="this.select()" placeholder="{app.lang.login.placehoder.password}">
          <a href="javascript:;" onclick={fn.pwdToggle} class="pwd-{pwd}"></a>
        </p>
        <div class="msg-space">
          <input-valid for="username,password" rule="required" msg="{app.lang.login.invalid}"></input-valid>
        </div>
        <p class="btn-line">
          <button onclick={fn.login}>{app.lang.login.btn}</button>
          <br>
          <a href="#!findpass">{app.lang.login.findpass}</a>
        </p>
      </div>
    </form>

  </div>

  <footer></footer>

  <script>

  var _this = this;
  _this.role = 'admin';
  _this.pwd = 'hide';
  _this.ref = _this.app.route.params[1] && _this.app.route.params[1].ref;

  _this.fn = {
    login: function(e){
      _this.tags['input-valid'].once('valid', function(target){
        e.target.innerText = _this.app.lang.login['btn:loading'];
        // 尝试登录
        _this.app.api('POST', 'login/default/index', {
          withCredentials: true,
          data: {
            'LoginForm[username]': target[0].value,
            'LoginForm[password]': target[1].value
          },
          trigger: e.target
        })
        .then(function(){
          e.target.innerText = _this.app.lang.login['btn:ok'];
          // 登录成功
          _this.app.utils.cookie.set('role', _this.role, {
            'max-age': 3600*24*7
          });
          // 如果有来源页
          if(_this.ref){
            location.href = (_this.app.route.params[1].ref);
          }
          else{
            // admin-index || user-index
            _this.app.route(_this.role+'-'+_this.app.config.indexPage);
          }
        })
        .catch(function(msg){
          // 接口失败错误信息提示
          _this.tags['input-valid'].emit(
            'msg', _this.app.lang.login.fail
          );
        });
        _this.app.on('api::complete', function(){
          e.target.innerText = _this.app.lang.login.btn;
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

  _this.on('mount', function(){
    if(_this.ref){
      // 告诉用户需要重新登录
      _this.tags['input-valid'].emit(
        'msg', _this.app.lang.login.relogin
      );
      _this.refs.username.focus();
    }
  });

  </script>

</fp-login>
