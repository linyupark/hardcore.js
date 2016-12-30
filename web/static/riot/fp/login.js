riot.tag2('fp-login', '<header for="login"></header><main class="login"><div class="container"><form class="login-from" onsubmit="return false"><p class="tab-line"><a href="javascript:;" class="{active: role==\'admin\'}" onclick="{fn.loginAdmin}">{app.lang.login.admin}</a><a href="javascript:;" class="{active: role==\'user\'}" onclick="{fn.loginUser}">{app.lang.login.user}</a></p><p><input type="text" ref="username" onclick="this.select()" placeholder="{app.lang.login.placehoder.username}"></p><p style="position: relative"><input type="password" ref="password" onclick="this.select()" placeholder="{app.lang.login.placehoder.password}"><a href="javascript:;" onclick="{fn.pwdToggle}" class="pwd-{pwd}"></a></p><div class="msg-space"><input-valid for="username,password" rule="required" msg="{app.lang.login.invalid}"></input-valid></div><p class="btn-line"><button ref="login" onclick="{fn.login}">{app.lang.login.btn}</button><br><a aria-label="请拨打联系电话找回密码" class="c-tooltip--top" href="javascript:;">{app.lang.login.findpass}</a></p></form></div></main><footer class="login"></footer>', '', '', function(opts) {

  var _this = this;
  _this.role = 'admin';
  _this.pwd = 'hide';
  _this.ref = _this.app.route.query.ref;
  _this.api = 'backend/default/login';
  _this.fn = {
    login: function(e){
      _this.tags['input-valid'].emit('check');
    },
    loginAdmin: function(){
      _this.role = 'admin';
      _this.api = 'backend/default/login';
    },
    loginUser: function(){
      _this.role = 'user';
      _this.api = 'frontend/default/login'
    },

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
      _this.refs.username.focus();
    }

    _this.tags['input-valid'].on('valid', function(target){

      _this.app.api('POST', _this.api, {
        withCredentials: true,
        data: {
          data: JSON.stringify({
            username: target[0].value,
            password: target[1].value
          })
        },
        trigger: _this.refs.login
      })
      .on('done', function(){
        _this.refs.login.innerText = _this.app.lang.login['btn:ok'];

        _this.app.utils.cookie.set('role', _this.role, {
          'max-age': 3600*24*7
        });
        _this.app.alert('登录成功', 'success');

        if(_this.ref){
          location.href = _this.ref;
        }
        else{

          _this.app.route(_this.role+'-'+_this.app.config.indexPage);
          window.scrollTo(0, 0);
        }
      })
      .off('error').on('error', function(msg){

        _this.tags['input-valid'].emit(
          'msg', _this.app.lang.login.fail
        );
      });
    });

  });

});
