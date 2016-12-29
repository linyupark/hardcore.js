riot.tag2('fp-account', '<header for="{role}"></header><main class="{role}"><div class="container center" style="min-height: 350px"><form class="account"><h4>帐号设置</h4><br><div class="row"><p><label>帐号名称</label><input type="text" style="border: none" ref="username" riot-value="{username}" disabled></p><hr><p><label class="center">密码</label><input type="password" ref="password" placeholder="长度6-20、不能全为数字"><input-valid ref="validOnSave" for="password" reg="(?!\\d+$).\\{6,20\\}" msg="长度6-20、不能全为数字"></input-valid></p><hr><p><label>确认新密码</label><input type="password" ref="confirm_password"><input-valid ref="validCFPassword" for="confirm_password" rule="required" msg=""></input-valid></p></div><br><div class="c1 btn-line" style="text-indent: 85px"><button type="button" onclick="{fn.save}" class="btn-yellow">{app.lang.admin.btn.save}</button><button type="button" onclick="{fn.cancel}" class="btn-gray">{app.lang.admin.btn.back}</button></div></form></div></main><footer class="{role}"></footer>', '', '', function(opts) {
  var _this = this;
  _this.role = _this.app.utils.cookie.get('role');
  _this.username = _this.app.utils.cookie.get('user_name');
  _this.fn = {
    cancel: function(e){
      history.back();
    },
    save: function(e){
      var api = _this.role == 'user' ? 'frontend/default/user-edit' :
      'backend/default/user-edit';

      _this.refs.validOnSave
      .on('valid', function(){

        if(_this.refs.confirm_password.value != _this.refs.password.value){
          return  _this.refs.validCFPassword.emit('check')
          .emit('msg', '确认密码与密码不一致');
        }
        _this.app.api('POST', api, {
          trigger: e.target,
          data: {
            username: _this.username,
            password: _this.refs.password.value
          }
        }).on('done', function(data){
          _this.app.alert('帐号密码修改成功', 'success');
        });
      })
      .emit('check');
    }
  };
  _this.on('mount', function(){

  });
});
