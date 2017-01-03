<fp-admin-setting-pjtype>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <section>
        <h2>管理后台 &gt; 设置 &gt; 项目类型管理</h2>

        <table-filter for="pjtype">
          <yield to="addon">
            <button class="main" onclick={parent.fn.add}>
              <i class="icon-plus"></i> 添加项目类型
            </button>
          </yield>
        </table-filter>

        <table class="base">
          <thead>
            <tr>
              <th width="20%">序号</th>
              <th width="40%">项目类型</th>
              <th width="20%">排序</th>
              <th width="20%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{sort}</td>
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

  <footer class="admin"></footer>

  <!-- 删除记录弹窗 -->
  <modal-remove/>

  <!-- 添加修改组织机构 -->
  <modal ref="saveType" w="400" h="260">
    <yield to="title">
      {parent.pjtype.id?'修改':'添加'}项目类型
    </yield>
    <yield to="content">
      <form class="modal">
        <div class="row">
          <p>
            <label>项目类型</label>
            <input ref="type_name" type="text" value="{parent.pjtype.name}">
          </p>
          <p>
            <label>排序</label>
            <input ref="type_sort" type="text" value="{parent.pjtype.sort}">
            <input-valid style="left: 85px" ref="validType" for="type_name,type_sort" rule="required" msg="项目类型跟排序都为必填"/>
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
  _this.pjtype = {};
  _this.fn = {
    remove: function(e){
      _this.tags['modal-remove']
      .once('ok', function(){
        _this.app.api('GET', 'system-setting/project-type/delete', {
          data: { id: e.item.id }
        }).on('done', function(){
          _this.app.alert('项目类型删除成功', 'success');
          _this.fn.getTypeList();
        })
      })
      .emit('open');
    },
    ok: function(e){
      var api = _this.pjtype.id ?
      'system-setting/project-type/update?id='+_this.pjtype.id :
      'system-setting/project-type/create';
      _this.refs.saveType.refs.validType
      .once('valid', function(){
        var sort = _this.refs.saveType.refs.type_sort.value;
        if(!Number(sort) || Number(sort) < 0){
          return this.emit('msg', '排序必须为正整数');
        }
        _this.app.api('POST', api, {
          trigger: e.target,
          data: {
            data: JSON.stringify({
              name: _this.refs.saveType.refs.type_name.value,
              sort: Number(sort)
            })
          }
        })
        .once('done', function(){
          _this.app.alert('操作成功', 'success');
          _this.fn.getTypeList();
          _this.refs.saveType.emit('close');
        });
      })
      .emit('check');
    },
    edit: function(e){
      _this.pjtype = e.item;
      _this.refs.saveType.emit('open');
      _this.refs.saveType.refs.validType.emit('msg', '');
    },
    add: function(){
      _this.pjtype = {};
      // 有遗留的错误信息需要先清除
      _this.refs.saveType.emit('open');
      _this.refs.saveType.refs.validType.emit('msg', '');
    },
    getTypeList: function(){
      _this.app.api('GET', 'system-setting/project-type/index', {
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
    _this.fn.getTypeList();
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
  })
  </script>

</fp-admin-setting-pjtype>