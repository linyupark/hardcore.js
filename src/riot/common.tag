<!-- 用户信息 -->
<userinfo>
  <div class="username" onmouseenter={fn.active}
    onmouseover={fn.active} onmouseleave={fn.hidden}>
    <a href="javascript:;" class="{active: active}">
      {user_name} <i class="{'icon-down-open-big': !active, 'icon-menu': active}"></i>
    </a>
    <dl class="menu {active: active}" onmouseenter={fn.active}
      onmouseover={fn.active} onmouseleave={fn.hidden}>
      <dd><a href="javascript:;">{app.lang.header.userinfo.account}</a></dd>
      <dd><a href="javascript:;">{app.lang.header.userinfo.logout}</a></dd>
    </dl>
  </div>

  <script>

  var _this = this;

  _this.active = false;

  _this.fn = {
    relogin: function(){
      _this.app.route(_this.app.config.loginPage+'?ref='+location.href);
    },
    active: function(){
      clearTimeout(_this.timer);
      _this.active = true;
    },
    hidden: function(){
      clearTimeout(_this.timer);
      _this.timer = setTimeout(function(){
        _this.active = false;
        _this.update();
      }, 800);
    }
  };

  _this.on('mount', function(){

    // 没有身份信息，要求重新登录
    _this.role = _this.app.utils.cookie.get('role');
    if(!_this.role){
      _this.fn.relogin();
    }

    // 能从cookie获取到的就不读接口
    if(_this.app.utils.cookie.get('user_name')){
      _this.user_name = _this.app.utils.cookie.get('user_name');
      _this.user_id = _this.app.utils.cookie.get('user_id');
    }
    else{
      // 获取资料信息
      _this.app.api('GET', 'login/default/user-info')
      // _this.app.api('GET', 'agreement/default/price', {
      //   data: {
      //     id: 144
      //   }
      // })
      .then(function(data){
        _this.user_name = data.user_name;
        _this.user_id = data.user_id;
        _this.app.utils.cookie.set('user_name', data.user_name);
        _this.app.utils.cookie.set('user_id', data.user_id);
      })
      .catch(function(){
        if(_this.app.config.env === 'dev'){
          _this.app.utils.cookie.set('user_name', '张三');
          _this.app.utils.cookie.set('user_id', 1);
          return;
        }
        _this.app.route(_this.app.config.loginPage+'?ref='+location.href);
      });
    }
    _this.update();

  });
  </script>

</userinfo>








<footer>
  <div class="wrapper">
    <!-- 底部信息 -->
    <p class="info">
      {app.lang.footer.icp} &copy; {app.lang.footer.copyright}
      <br>
      {app.lang.footer.address}
      <br>
      {app.lang.footer.tel}
    </p>
  </div>
</footer>







<header class="{opts.for}">

  <div class="wrapper">

    <!-- 登录页header -->
    <div if={opts.for==='login'} class="login-header">
      <h1>
        {app.lang.header.sitename}
      </h1>
    </div>

    <!-- 捐赠人header -->
    <div if={opts.for==='user'} class="user-header">
      <h1>
        {app.lang.header.sitename}
      </h1>
      <userinfo></userinfo>
    </div>

    <!-- 管理员header -->
    <div if={opts.for==='admin'} class="admin-header">
      <h1>
        {app.lang.header.sitename}
      </h1>
      <userinfo></userinfo>
    </div>

  </div>

  <script>
  </script>

</header>






<header-nav>

  <ul>
    <li each={nav in data}
      onmouseenter={fn.showSubNav}
      onmouseleave={fn.hideSubNav}>
      <a href="javascript:;" onclick={fn.navTo}>{nav.name}</a>
      <ul class="sub" if={nav.sub && nav.subShow}>
        <li each={sub in nav.sub}>
        <a href="javascript:;" onclick={fn.subNavTo}>{sub.name}</a>
        </li>
      </ul>
    </li>
  </ul>

  <script>

  var _this = this;
  // 导航数据
  _this.data = _this.app.data['header-nav'];
  _this.fn = {
    navTo: function(e){
      if(e.item.nav.sub) return;
      else _this.app.route(e.item.nav.url);
    },
    subNavTo: function(e){
      _this.app.route(_this._base_url+e.item.sub.url);
    },
    showSubNav: function(e){
      _this._base_url = e.item.nav.url;
      e.item.nav.subShow = true;
    },
    hideSubNav: function(e){
      delete _this._base_url;
      e.item.nav.subShow = false;
    }
  };
  </script>

</header-nav>
