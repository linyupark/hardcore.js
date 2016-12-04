
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
  _this.data = _this.app.loaderJSON['header-nav'];
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
