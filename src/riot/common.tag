<!-- 侧栏导航 -->
<admin-sidenav>
  <style scoped>
  .child{display: none}
  .unfold{display: block}
  .icon-angle-down,
  .icon-menu{float: right; margin-right: 20px; color: #666;}
  </style>
  <ul>
    <li each={m in data}>
      <a href="{m.url?'#!'+m.url:'javascript:;'}"
        onclick={fn.toggle}
        class={active: parent.url==m.url}>
        <i class="icon-{m.icon}"></i>
        {m.name}
        <i class="{
        'icon-menu': m.child==parent.child,
        'icon-angle-down': m.child&&parent.child!=m.child
        }" if={m.child}></i>
      </a>
      <ul if={m.child} class="child {unfold: parent.child==m.child}">
        <li each={s in m.child}>
          <a href="#!{s.url}">
            <i class="icon-{s.icon}"></i>
            {s.name}
          </a>
        </li>
      </ul>
    </li>
  </ul>
  <script>
  var _this = this;
  _this.data = _this.app.lang.admin.sidenav;
  _this.fn = {
    toggle: function(e){
      if(e.item.m.child){
        if(e.item.m.child == _this.child){
          // 关闭
          delete _this.child;
        }
        else{
          _this.child = e.item.m.child;
        }
      }
    }
  };
  _this.on('mount', function(){
    window.scrollTo(0, 0);
    // 展开，高亮对应的tab
    _this.url = _this.app.route.params[0] || 'index';
    _this.update();
  });

  </script>
</admin-sidenav>


<!-- table筛选过滤 -->
<table-filter>
  <!-- 协议管理 -->
  <div if={opts.for=='agreement'}>
    {app.lang.admin.search.condition}:
    <select ref="agreement">
      <option each={app.lang.admin.agreement['search:types']} value={key} selected={type==key}>{name}</option>
    </select>
    <input type="text" ref="keyword" value={keyword} onclick="this.select()" onkeyup={fn.enter} placeholder="{app.lang.admin.search.keyword.placehoder}">
    <button style="margin-left: -5px" class="gray" onclick={fn.search}><i class="icon-search"></i></button>
    <a show={app.route.query.keyword} href="javascript:;" onclick={fn.reset}>{app.lang.admin.reset}</a>
  </div>
  <div class="addon">
    <yield from="addon"></yield>
  </div>
  <script>
  var _this = this;
  _this.fn = {
    reset: function(){
      _this.app.route.query = {};
      _this.app.query();
    },
    enter: function(e){
      if(e.keyCode == 13){
        _this.fn.search();
      }
    },
    search: function(){
      if(opts.for === 'agreement'){
        _this.app.route.query.type = _this.refs.agreement.value || '';
        _this.app.route.query.keyword = _this.refs.keyword.value || '';
        _this.app.query();
      }
    }
  };
  _this.on('mount', function(){
    if(opts.for === 'agreement'){
      _this.type = _this.app.route.query.type;
      _this.keyword = _this.app.route.query.keyword;
    }
    _this.update();
  });
  </script>
</table-filter>


<!-- 用户信息 -->
<userinfo>
  <div class="username" onmouseenter={fn.active}
    onmouseover={fn.active} onmouseleave={fn.hidden}>
    <a href="javascript:;" class="{active: active}">
      {app.data.user_name} <i class="{'icon-angle-down': !active, 'icon-menu': active}"></i>
    </a>
    <dl class="menu {active: active}" onmouseenter={fn.active}
      onmouseover={fn.active} onmouseleave={fn.hidden}>
      <dd><a href="javascript:;">{app.lang.header.userinfo.account}</a></dd>
      <dd><a href="javascript:;" onclick={fn.logout}>{app.lang.header.userinfo.logout}</a></dd>
    </dl>
  </div>

  <script>

  var _this = this;

  _this.active = false;

  _this.fn = {
    logout: function(){
      _this.app.api('GET', 'login/default/logout')
      .on('done', function(data){
        _this.app.alert(_this.app.lang.login.out, 'success');
        _this.app.route(_this.app.config.loginPage);
      });
    },
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
      return _this.fn.relogin();
    }

    // 能从cookie获取到的就不读接口
    if(_this.app.utils.cookie.get('user_name')){
      _this.app.data.user_name = _this.app.utils.cookie.get('user_name');
      _this.app.data.user_id = _this.app.utils.cookie.get('user_id');
    }
    else{
      // 获取资料信息
      _this.app.api('GET', 'login/default/user-info')
      .on('done', function(data){
        _this.app.data.user_name = data.user_name;
        _this.app.data.user_id = data.user_id;
        _this.app.utils.cookie.set('user_name', data.user_name);
        _this.app.utils.cookie.set('user_id', data.user_id);
        _this.update();
      })
      .off('fail').on('fail', function(){
        _this.app.alert(_this.app.lang.login.relogin, 'warning');
        _this.fn.relogin();
      });
    }
    _this.update();

  });
  </script>

</userinfo>








<footer>
  <div class="container">
    <!-- 底部信息 -->
    <p class="info">
      {app.lang.footer.icp} &copy; {app.lang.footer.copyright}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {app.lang.footer.address}
      &nbsp;&nbsp;&nbsp;&nbsp;
      {app.lang.footer.tel}
    </p>
  </div>
</footer>







<header class="{opts.for}">

  <!-- 顶部信息框 -->
  <alert></alert>

  <div class="container {center: opts.for!=='admin'}">

    <!-- 登录页header -->
    <div class="row" if={opts.for==='login'}>
      <h1>
        {app.lang.header.sitename}
      </h1>
    </div>

    <!-- 捐赠人header -->
    <div class="row" if={opts.for==='user'}>
      <h1>
        {app.lang.header.sitename}
      </h1>
      <userinfo></userinfo>
    </div>

    <!-- 管理员header -->
    <div class="row" if={opts.for==='admin'}>
      <h1>
        {app.lang.header.sitename}
      </h1>
      <userinfo></userinfo>
    </div>

  </div>

  <script>
  var _this = this;
  _this.alert = {};
  _this.on('mount', function(){
    document.body.setAttribute('class', opts.for);
  });

  // 自定义信息
  _this.app.off('alert').on('alert', function(msg, type){
    _this.app.log(msg);
    // 加载后
    _this.tags['alert'] &&
    _this.tags['alert'].emit('message', msg, type);
  });

  </script>

</header>
