<fp-admin-user>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <section>
        <h2>用户管理</h2>

        <table-filter for="user">
          <yield to="addon">
            <button class="main" onclick={parent.fn.add}>
              <i class="icon-plus"></i> 添加用户
            </button>
          </yield>
        </table-filter>

        <table class="base">
          <thead>
            <tr>
              <th width="10%">序号</th>
              <th width="10%">姓名</th>
              <th width="10%">性别</th>
              <th width="10%">系统角色</th>
              <th width="10%">用户类型</th>
              <th width="20%">手机号</th>
              <th width="10%">注册时间</th>
              <th width="20%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>

            </tr>
            <tr if={!tableList}>
              <td colspan="8"><spinner-dot/></td>
            </tr>
          </tbody>
          <tfoot if={tableList}>
            <tr>
              <td class="left" colspan="8">
                {app.lang.admin.counts.items}
                <b>{items}</b>
                {app.lang.admin.counts.unit}
              </td>
            </tr>
          </tfoot>
        </table>

        <pagination-number page={page} pages={pages} select="y"/>
      </section>
    </div>
  </main>

  <footer></footer>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.fn = {
    getUserList: function(){
      _this.app.api('GET', 'user-manager/default/index', {
        data: {
          page: _this.q.page || 1
        }
      }).on('done', function(data){
        _this.update({
          tableList: data.items,
          page: data.counts.page,
          pages: data.counts.total_page,
          items: data.counts.total_items
        });
        _this.tags['pagination-number'].emit('render');
      });
    }
  };
  this.on('mount', function(){
    _this.fn.getUserList();
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
  })
  </script>

</fp-admin-user>
