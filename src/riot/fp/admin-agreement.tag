<fp-admin-agreement>

  <header for="admin"></header>

  <div class="body admin">

    <div class="wrapper">
      <side-nav></side-nav>
      <section>
        <h2>{app.lang.admin.agreement.title}</h2>
        <table-filter for="agreement"></table-filter>
        <table class="base">
          <thead>
            <tr>
              <th width="10%">{app.lang.admin.agreement.id}</th>
              <th width="10%">{app.lang.admin.agreement.number}</th>
              <th width="50%">{app.lang.admin.agreement.name}</th>
              <th width="10%">{app.lang.admin.agreement.contract}</th>
              <th width="10%">{app.lang.admin.agreement.due}</th>
              <th width="10%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>
              <td>{id}</td>
              <td>{agreement_number}</td>
              <td class="left">{agreement_name}</td>
              <td>{app.utils.time2str(contract_date)}</td>
              <td>{app.utils.time2str(due_date)}</td>
              <td>
                <i onclick={fn.edit} class="icon-btn icon-pencil"></i>
                <i onclick={fn.remove} class="icon-btn icon-trash-empty"></i>
              </td>
            </tr>
            <tr if={tableList&&tableList.length==0}>
              <td colspan="6">{app.lang.admin.empty}</td>
            </tr>
            <tr if={!tableList}>
              <td colspan="6"><spinner-dot/></td>
            </tr>
          </tbody>
        </table>

        <pagination-number show={pages>1} page={page} pages={pages} select="y"></pagination-number>

      </section>
    </div>

  </div>

  <footer class="admin"></footer>

  <!-- 删除记录弹窗 -->
  <modal>
    <yield to="title">{app.lang.admin.confirm.tips}</yield>
    <yield to="content">{app.lang.admin.confirm.delete}</yield>
    <yield to="button">
      <button class="primary-btn">{app.lang.admin.btn.ok}</button>
    </yield>
    <yield to="close">{app.lang.admin.btn.cancel}</yield>
  </modal>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.page = _this.q.page || 1;
  _this.pages = 10;
  _this.fn = {
    edit: function(e){
      _this.app.emit('animation', e.target, 'shake');
      _this.app.emit('message::header', _this.app.lang.admin.deny);
    },
    remove: function(e){
      _this.tags['modal'].emit('open');
    },
    getList: function(){
      // 获取协议列表
      // page 分页
      // (例：page=1,每页20条)
      // search_type 搜索类别
      // (值:agreement_number协议编号/agreement_name协议名称/donor_id捐赠方id)
      // search_keyword 搜索关键字
      _this.app.api('GET', 'agreement/default/index', {
        data: {
          page: _this.page,
          search_type: _this.q.type,
          search_keyword: _this.q.keyword
        }
      }).then(function(data){
        _this.update({
          tableList: data.items,
          page: data.counts.page,
          pages: data.counts.total_page+10
        });
      });
    }
  };
  _this.on('mount', function(){
    _this.fn.getList();
    _this.tags['pagination-number'].on('page', function(page){
      _this.q.page = page;
      _this.app.query();
      // _this.app.log('admin-agreement page ', page);
    });
    // _this.app.log('admin-agreement tag mounted');
  });
  </script>

</fp-admin-agreement>
