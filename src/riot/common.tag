<!-- 职务查询 -->
<place-select>
  <input-select name="place_name" ref="place_name" placehoder="搜索选择" value=""/>
  <input type="hidden" ref="place_id" value=""/>
  <input-valid style="{opts.left&&'left:'+opts.left+'px'}" ref="validPlace" for="place_id" rule="required" msg="请选择职务"/>
  <script>
  var _this = this;
  _this.keywordCache = {};
  // 外露函数
  _this.getId = function(){
    return _this.refs.place_id.value;
  };
  _this.on('mount', function(){
    // 请求职务数据
    _this.refs.place_name.on('pull', function(keyword){
      _this.refs.validPlace.emit('msg', '');
      if(_this.keywordCache[keyword]){
        return _this.refs.place_name.emit(
          'push', _this.keywordCache[keyword]
        );
      }
      _this.app.api('GET', 'system-setting/place/search', {
        data: { keyword: keyword }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.place_name.emit('push', data.items);
      });

    });
    // 选择了职务
    _this.refs.place_name.on('select', function(item){
      _this.refs.place_id.value = item.id || '';
      _this.refs.place_name.value = item.place_name || '';
    });
  });
  // 检查数据
  _this.on('check', function(){
    _this.refs.validPlace
    .on('valid', function(){
      _this.emit('valid');
    }).on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });
  // 设置默认显示值
  _this.on('set', function(place){
    _this.refs.place_id.value = place.id;
    _this.refs.place_name.value = place.name;
    _this.refs.place_name.emit('value', place.name);
  });
  </script>
</place-select>


<!-- 捐赠方下拉选择 -->
<donor-select>
  <input-select name="donor_name" ref="donor_name" placehoder="搜索选择" value=""/>
  <input type="hidden" ref="donor_id" value=""/>
  <input-valid style="{opts.left&&'left:'+opts.left+'px'}" ref="validDonor" for="donor_id" rule="required" msg="请选择捐赠方"/>
  <script>
  var _this = this;
  _this.keywordCache = {};
  // 外露函数
  _this.getId = function(){
    return _this.refs.donor_id.value;
  };
  _this.on('mount', function(){

    // 请求捐赠方数据
    _this.refs.donor_name.on('pull', function(keyword){

      _this.refs.validDonor.emit('msg', '');

      if(_this.keywordCache[keyword]){
        return _this.refs.donor_name.emit(
          'push', _this.keywordCache[keyword]
        );
      }

      _this.app.api('GET', 'donor/default/search', {
        data: { keyword: keyword }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.donor_name.emit('push', data.items);
      });

    });

    // 选择了捐赠方
    _this.refs.donor_name.on('select', function(item){
      _this.refs.donor_id.value = item.id || '';
      _this.refs.donor_name.value = item.donor_name || '';
    });
  });

  // 检查数据
  _this.on('check', function(){
    _this.refs.validDonor
    .on('valid', function(){
      _this.emit('valid');
    }).on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });
  // 设置默认显示值
  _this.on('set', function(donor){
    _this.refs.donor_id.value = donor.id;
    _this.refs.donor_name.value = donor.name;
    _this.refs.donor_name.emit('value', donor.name);
  })
  </script>
</donor-select>


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
  <!-- 项目管理 -->
  <div if={opts.for=='project'}>
  按条件筛选：
  <a class="tab-sub {active: app.route.query.status==key}" href="javascript:;" onclick={fn.tab} each={projectStatusList}>{name}</a>
  </div>
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
  _this.projectStatusList = [{
    name: "全部", key: "all"
  }].concat(_this.app.lang.admin.project['filter:status']);
  _this.fn = {
    tab: function(e){
      _this.app.route.query.status = e.item.key;
      _this.app.query();
    },
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
    if(opts.for === 'project'){
      _this.app.route.query.status =
      _this.app.route.query.status || '';
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
    // relogin: function(){
    //   _this.app.route(_this.app.config.loginPage+'?ref='+location.href);
    // },
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
    // _this.role = _this.app.utils.cookie.get('role');
    // if(!_this.role){
    //   return _this.fn.relogin();
    // }

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
      // .off('fail').on('fail', function(){
      //   _this.app.alert(_this.app.lang.login.relogin, 'warning');
      //   _this.fn.relogin();
      // });
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
    // _this.app.log(msg);
    // 加载后
    _this.tags['alert'] &&
    _this.tags['alert'].emit('message', msg, type);
  });

  </script>

</header>
