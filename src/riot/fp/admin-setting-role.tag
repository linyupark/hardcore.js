<fp-admin-setting-role>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <section>
        <h2>设置 &gt; 角色管理</h2>
        <table class="base">
          <thead>
            <tr>
              <th width="20%">序号</th>
              <th width="30%">角色名</th>
              <th width="30%">描述</th>
              <th width="20%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>

            </tr>
            <tr if={!tableList}>
              <td colspan="4"><spinner-dot/></td>
            </tr>
          </tbody>
          <tfoot if={tableList}>
            <tr>
              <td class="left" colspan="4">
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
    getList: function(){
      _this.app.api('GET', 'role-manager/default/index', {
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
    _this.fn.getList();
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
  })
  </script>

</fp-admin-setting-role>
