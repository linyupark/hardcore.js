<fp-admin-donor>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <!-- 列表页面 -->
      <section if={section=='index'}>

        <h2>{app.lang.admin.donor.title}</h2>

        <table-filter for="donor">
          <yield to="addon">
            <button class="main" onclick={parent.fn.add}>
              <i class="icon-plus"></i> {app.lang.admin.donor.add}
            </button>
          </yield>
        </table-filter>

        <table class="base">
          <thead>
            <tr>
              <th width="10%">{app.lang.admin.donor.id}</th>
              <th width="40%">{app.lang.admin.donor.name}</th>
              <th width="10%">{app.lang.admin.donor.type}</th>
              <th width="10%">{app.lang.admin.donor.contact}</th>
              <th width="20%">{app.lang.admin.donor.tel}</th>
              <th width="10%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>
              <td>{id}</td>
              <td class="left">{donor_name}</td>
              <td>{fn.getNatureName(type)}</td>
              <td>{contact||'-'}</td>
              <td>{tel}</td>
              <td>
                <a href="javascript:;" aria-label="{app.lang.admin.handles.view}" class="c-tooltip--top">
                  <i onclick={fn.view}  class="btn-icon icon-menu"></i>
                </a>
                <a href="javascript:;" aria-label="{app.lang.admin.handles.edit}" class="c-tooltip--top">
                  <i onclick={fn.edit}  class="btn-icon icon-pencil"></i>
                </a>
                <a href="javascript:;" aria-label="{app.lang.admin.handles.remove}" class="c-tooltip--top">
                  <i onclick={fn.remove}  class="btn-icon icon-trash"></i>
                </a>
              </td>
            </tr>
            <tr if={!tableList}>
              <td colspan="6"><spinner-dot/></td>
            </tr>
          </tbody>
          <tfoot if={tableList}>
            <tr>
              <td class="left" colspan="6">
                {app.lang.admin.counts.items}
                <b>{items}</b>
                {app.lang.admin.counts.unit}
              </td>
            </tr>
          </tfoot>
        </table>

        <pagination-number show={pages>1} page={page} pages={pages} select="y"/>

      </section>
    </div>
  </main>

  <footer class="admin"></footer>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.section = _this.app.route.params[1] || 'index';
  _this.fn = {
    getNatureName: function(type){
      var name;
      _this.app.lang.admin.agreement['donor:nature:list']
      .forEach(function(item){
        if(item.key == type) name = item.name;
      });
      return name || '';
    },
    getList: function(){
      _this.app.api('GET', 'donor/default/index', {
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
    if(_this.section === 'index'){
      _this.fn.getList();
      _this.tags['pagination-number'].on('change', function(n){
        _this.q.page = n;
        _this.app.query();
      });
    }
  })
  </script>

</fp-admin-donor>
