<fp-admin-setting-log>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <section>
        <h2>设置 &gt; 系统日志</h2>
        <table class="base" style="min-height: 634px">
          <thead>
            <tr>
              <th width="20%">日期</th>
              <th width="10%">用户名</th>
              <th width="10%">身份</th>
              <th width="40%">操作描述</th>
              <th width="20%">IP</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>
              <td>{app.utils.time2str(created_at, {showtime:true})}</td>
              <td>{user_name}</td>
              <td>{user_role}</td>
              <td class="left">{description}</td>
              <td>{ip}</td>
            </tr>
            <tr if={!tableList}>
              <td colspan="5"><spinner-dot/></td>
            </tr>
          </tbody>
          <tfoot if={tableList}>
            <tr>
              <td class="left" colspan="5">
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
    getLogList: function(){
      _this.app.api('GET', 'system-setting/logs/index', {
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
    _this.fn.getLogList();
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
  })
  </script>

</fp-admin-setting-log>
