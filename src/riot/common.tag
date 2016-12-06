
<footer>
  <div class="wrapper">
    <!-- 底部信息 -->
    <p class="info">
      {app.lang.footer.icp} &copy; {app.lang.footer.copyright}
      <br>
      {app.lang.footer.address} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {app.lang.footer.tel}
    </p>
  </div>
</footer>

<header>

  <div class="wrapper">

    <!-- 登录页header -->
    <div show={opts.for==='login'} class="login-header">
      <h1>
        {app.lang.header.sitename}
      </h1>
    </div>

    <!-- 捐赠人header -->
    <div show={opts.for==='user'} class="user-header">

    </div>

    <!-- 管理员header -->
    <div show={opts.for==='admin'} class="admin-header">

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
