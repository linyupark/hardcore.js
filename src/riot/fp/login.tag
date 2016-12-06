<fp-login>

  <div class="row">
    <div class="col l6 push-l3 m6 push-m3 s11">
      <h4>请登录</h4>
      <p>
        <input placeholder="账号" ref="account" type="text">
      </p>
      <p>
        <input placeholder="密码" ref="password" type="password">
      </p>
      <p>
        <input-valid for="account,password" rule="required" msg="账号密码不能为空"></input-valid>
        <button onclick={fn.login} class="btn" name="action">
          提&nbsp;交
        </button>
      </p>
    </div>
  </div>

  <script>
  var _this = this;
  _this.fn = {
    login: function(e){
      _this.tags['input-valid'].emit('check');
      // for(var i in _this.tags['input-valid']){
      //   _this.tags['input-valid'][i].emit('check');
      // }
    }
  };
  _this.on('mount', function() {
    _this.app.log('login mounted');
  });
  </script>

</fp-login>
