<fp-admin-project>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <section if={section=='index'}>
        <h2>{app.lang.admin.project.title}</h2>
        <!-- 我的项目、所有项目 -->
        <div class="table-tab">
          <a href="javascript:;" onclick={fn.filterRange} each={filterRange} class={active:q.range==key}>{name}</a>
        </div>
        <table-filter for="project">
          <yield to="addon">
            <button class="main" onclick={parent.fn.add}>
              <i class="icon-plus"></i> {app.lang.admin.project.add}
            </button>
          </yield>
        </table-filter>

      </section>
    </div>
  </main>

  <footer class="admin"></footer>

  <script>
  var _this = this;
  // 获取当前location.query
  _this.q = _this.app.route.query;
  // 默认列表页
  _this.section = _this.app.route.params[1] || 'index';
  // 项目过滤(我的、全部)
  _this.filterRange = _this.app.lang.admin.project['filter:range'];

  _this.fn = {
    filterRange: function(e){
      _this.q.range = e.item.key;
      _this.app.query();
    }
  };

  this.on('mount', function(){
    if(_this.section === 'index'){
      // 默认显示我的项目
      _this.q.range = _this.q.range || "my";
      _this.update();
    }
  });

  </script>

</fp-admin-project>
