
<!-- 角色权限修改表单 -->
<role-form>

  <section>
    <h2>管理后台 &gt; 设置 &gt; 角色管理 &gt; {role.name?'修改':'添加'}角色</h2>
    <form class="role">
      <!-- 基础信息 -->
      <h4>基础信息</h4>
      <div class="c2">
        <div class="row">
          <p>
            <label>角色名称</label>
            <input type="text" ref="description" value="{role.description}" placeholder="必填">
            <input-valid ref="validOnSave" for="description" rule="required" msg="必填"/>
          </p>
        </div>
      </div>
      <div class="c2">
        <div class="row">
          <p>
            <label>角色代码</label>
            <input type="text" ref="name" value="{role.name}" placeholder="必填">
            <input-valid ref="validOnSave" for="name" rule="required" msg="必填"/>
          </p>
        </div>
      </div>
      <br>
      <h4>设置权限</h4>
      <div class="roles" each={lv1, n1 in permissionList}>
        <h5 class="lv1">
          {n1+1}.{lv1.label}
        </h5>
        <div class="child" each={lv2, n2 in lv1.child}>
          <label>
            <input if={lv2.value} onclick={fn.choose} type="checkbox" value={lv2.value} checked="{fn.isChoosed(lv2.value)}">
            {n1+1}.{n2+1} {lv2.label}
          </label>
          <div if={lv2.child} class="child">
            <label each={lv3, n3 in lv2.child}>
              <input if={lv3.value} type="checkbox" onclick={fn.choose} value={lv3.value} checked="{fn.isChoosed(lv3.value)}">
              {n1+1}.{n2+1}.{n3+1} {lv3.label}
            </label>
          </div>
        </div>
      </div>
      <hr>
      <br>
      <div class="c1 btn-line">
        <button type="button" onclick={fn.save} class="btn-yellow">{app.lang.admin.btn.save}</button>
        <button type="button" onclick={fn.cancel} class="btn-gray">{app.lang.admin.btn.back}</button>
      </div>
    </form>
  </section>

  <script>
  var _this = this;
  _this.role = {
    name: _this.app.route.params[2] || null,
    choosed: []
  };
  _this.permissionList = [];
  _this.fn = {
    save: function(e){
      var api = _this.role.name ?
       'role-manager/default/update?id='+_this.role.name :
       'role-manager/default/create';
      // 校验
      _this.app.validAll(_this.refs.validOnSave)
      .then(function(){
        _this.app.api('POST', api, {
          trigger: e.target,
          data: {
            data: JSON.stringify({
              name: _this.refs.name.value,
              description: _this.refs.description.value,
              choosed: _this.role.choosed
            })
          }
        }).on('done', function(){
          _this.app.alert('角色权限信息保存成功', 'success');
          // 跳转到列表
          !_this.role.name && _this.app.route('admin-setting-role');
        });
      }).catch(function(){
        _this.app.alert('请检查表单', 'warning');
      });
    },
    cancel: function(){
      history.back();
    },
    getRole: function(){
      _this.app.api('GET', 'role-manager/default/update', {
        data: {id: _this.role.name}
      })
      .on('done', function(data){
        _this.update({
          role: data
        });
      });
    },
    getPermissionList: function(){
      _this.app.api('GET', 'role-manager/default/permission')
      .on('done', function(data){
        _this.update({
          permissionList: data.items
        });
        if(_this.role.name){
          _this.fn.getRole();
        }
      });
    },
    isChoosed: function(v){
      return _this.role.choosed.indexOf(v) !== -1;
    },
    choose: function(e){
      var
        v = e.target.value,
        isChoosed = _this.role.choosed.indexOf(v) !== -1;
      if(v && e.target.checked && !isChoosed){
        _this.role.choosed.push(v);
      }
      if(!e.target.checked && isChoosed){
        _this.role.choosed.splice(_this.role.choosed.indexOf(v), 1);
      }
    }
  };
  _this.on('mount', function(){
    _this.fn.getPermissionList();
  });
  </script>
</role-form>


<fp-admin-setting-role>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <role-form if={section=='add'}/>
      <role-form if={section=='edit'}/>
      <section if={section=='index'}>
        <h2>管理后台 &gt; 设置 &gt; 角色管理</h2>
        <table-filter for="role">
          <yield to="addon">
            <button class="main" onclick={parent.fn.add}>
              <i class="icon-plus"></i> 添加角色
            </button>
          </yield>
        </table-filter>
        <table class="base">
          <thead>
            <tr>
              <th width="30%">角色</th>
              <th width="30%">代码</th>
              <th width="10%">数量</th>
              <th width="20%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>
              <td>{description}</td>
              <td>{name}</td>
              <td>{sum}</td>
              <td>
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
  <modal-confirm type="delete"/>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.section = _this.app.route.params[1] || 'index';
  _this.fn = {
    remove: function(e){
      _this.tags['modal-confirm']
      .once('ok', function(){
        _this.app.api('GET', 'role-manager/default/delete', {
          data: { name: e.item.name }
        }).on('done', function(){
          _this.app.alert('角色删除成功', 'success');
          _this.fn.getList();
        })
      })
      .emit('open');
    },
    add: function(){
      _this.app.route(_this.app.route.path + '/add');
    },
    edit: function(e){
      _this.app.route(_this.app.route.path + '/edit/' + e.item.name);
    },
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
    if(_this.section !== 'index') return;
    _this.fn.getList();
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
  })
  </script>

</fp-admin-setting-role>
