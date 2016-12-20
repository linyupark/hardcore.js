<fp-admin-setting-org>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <section>
        <h2>设置 &gt; 组织机构管理
          <span each={parentList}>
            &gt; <a href="javascript:;" class="under-line" onclick={fn.back}>{name}</a>
          </span>
        </h2>

        <table-filter for="org">
          <yield to="addon">
            <button class="main" onclick={parent.fn.add}>
              <i class="icon-plus"></i> 添加组织机构
            </button>
          </yield>
        </table-filter>

        <table class="base">
          <thead>
            <tr>
              <th width="20%">编号</th>
              <th width="40%">组织名称</th>
              <th width="20%">子类</th>
              <th width="20%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>
              <td>{id}</td>
              <td><a href="javascript:;" onclick="{fn.next}" class="under-line">{name}</a></td>
              <td>{parent_id}</td>
              <td>
                <!-- 操作 -->
                <a href="javascript:;" aria-label="{app.lang.admin.handles.edit}" class="c-tooltip--top">
                  <i onclick={fn.edit}  class="btn-icon icon-pencil"></i>
                </a>
                <a href="javascript:;" aria-label="{app.lang.admin.handles.remove}" class="c-tooltip--top">
                  <i onclick={fn.remove}  class="btn-icon icon-trash"></i>
                </a>
              </td>
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

  <!-- 添加修改组织机构 -->
  <modal ref="saveOrg" w="400" h="260">
    <yield to="title">
      {parent.org.id?'添加':'修改'}内容
    </yield>
    <yield to="content">
      <form class="modal">
        <div class="row">
          <p>
            <label>组织名称</label>
            <input ref="org_name" type="text" value="{parent.org.name}">
          </p>
          <p>
            <label>排序</label>
            <input ref="org_sort" type="text" value="{parent.org.sort}">
            <input-valid style="left: 85px" ref="validOrg" for="org_name,org_sort" rule="required" msg="组织名称跟排序都为必填"/>
          </p>
        </div>
      </form>
    </yield>
    <yield to="button">
      <button type="button" onclick="{parent.fn.ok}"  class="btn-main">{app.lang.admin.btn.ok}</button>
    </yield>
    <yield to="close">{app.lang.admin.btn.cancel}</yield>
  </modal>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.org = {};
  _this.parentList = [
    {pid: 0, name: '一级组织'}
  ];
  _this.fn = {
    back: function(e){
      var i = _this.parentList.indexOf(e.item);
      if(i==0) i = 1;
      _this.parentList.splice(i, _this.parentList.length-i);
      _this.fn.getOrgList();
    },
    next: function(e){
      _this.parentList.push({
        pid: e.item.id,
        name: e.item.name
      });
      _this.fn.getOrgList();
    },
    ok: function(e){
      var api = _this.org.id ?
      'system-setting/organization/update?id='+_this.org.id :
      'system-setting/organization/create';
      _this.refs.saveOrg.refs.validOrg
      .once('valid', function(){
        _this.app.api('POST', api, {
          trigger: e.target,
          data: {
            data: JSON.stringify({
              parent_id: _this.parentList.slice(-1)[0].pid,
              name: _this.refs.saveOrg.refs.org_name.value,
              sort: _this.refs.saveOrg.refs.org_sort.value
            })
          }
        })
        .once('done', function(){
          _this.app.alert('操作成功', 'success');
          _this.fn.getOrgList();
          _this.refs.saveOrg.emit('close');
        });
      })
      .emit('check');
    },
    edit: function(e){
      _this.org = e.item;
      _this.refs.saveOrg.refs.validOrg.emit('msg', '');
      _this.refs.saveOrg.emit('open');
    },
    add: function(){
      _this.org = {};
      // 有遗留的错误信息需要先清除
      _this.refs.saveOrg.refs.validOrg.emit('msg', '');
      _this.refs.saveOrg.emit('open');
    },
    getOrgList: function(){
      _this.app.api('GET', 'system-setting/organization/index', {
        data: {
          page: _this.q.page || 1,
          parent_id: _this.parentList.slice(-1)[0].pid
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
    _this.fn.getOrgList();
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
  })
  </script>

</fp-admin-setting-org>