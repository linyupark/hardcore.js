
<user-form>
  <section>
    <h2>用户管理 &gt; {uid?'修改':'新增'}用户信息</h2>
    <form class="user">
      <h4>帐号及权限</h4>
      <div class="c2">
        <div class="row">
          <p>
            <label style="text-align: center;">帐号</label>
            <input type="text" ref="username" value="{user.username}" placeholder="数字或字母，长度6-50">
            <input-valid ref="validOnSave" for="username" reg="[\d|\w]\{6,50\}" msg="数字或字母，长度6-50"/>
          </p>
        </div>
        <div class="row">
          <p>
            <label style="text-align: center;">密码</label>
            <input type="text" ref="password" value="{user.password}" placeholder="6-20个英文字母数字或符号，不能纯数字">
            <input-valid ref="validOnSave" for="password" reg="(?!\d+$).\{6,20\}" msg="6-20个英文字母数字或符号，不能纯数字"/>
          </p>
          <p>
            <label>确认密码</label>
            <input type="text" ref="confirm_password" value="" placeholder="跟密码保持一致">
            <input-valid ref="validCFPassword" for="confirm_password" rule="required" msg=""/>
          </p>
        </div>
        <div class="row">
          <p>
            <label>角色权限</label>
            <role-select ref="role"/>
          </p>
          <p>
            <label>捐赠方</label>
            <donor-select ref="donor"/>
          </p>
        </div>
        <div class="row c4">
          <p style="width: 100%">
            <label>组织结构</label>
            <org-select ref="organization"/>
          </p>
        </div>
        <div class="row">
          <p>
            <label>项目后台</label>
            <input id="is_manager" ref="is_manager" style="vertical-align: middle" type="checkbox" checked="{user.is_manager==1}">
            <label for="is_manager" style="width: 50%; margin-left:10px;">
              允许进入项目管理后台
            </label>
          </p>
        </div>
      </div>
      <hr>
      <br>
      <h4>执行信息</h4>
      <div class="c2">
        <div class="row">
          <p>
            <label style="text-align: center">姓名</label>
            <input type="text" ref="real_name" value="{user.real_name}" placeholder="必填">
            <input-valid for="real_name" rule="required" msg="必填"/>
          </p>
          <p>
            <label style="text-align: center">性别</label>
            <select ref="sex">
              <option value="1" selected="{user.sex==1}">男</option>
              <option value="0" selected="{user.sex==0}">女</option>
            </select>
          </p>
        </div>
        <div class="row">
          <p>
            <label style="text-align: center">职务</label>
            <place-select ref="place"/>
          </p>
          <p>
            <label style="text-align: center">电话</label>
            <input ref="tel" type="text" value="{user.tel}">
          </p>
        </div>
        <div class="row">
          <p>
            <label>公司名称</label>
            <input ref="company" type="text" value="{user.company}">
          </p>
          <p>
            <label>公司电话</label>
            <input ref="company_tel" type="text" value="{user.company_tel}">
          </p>
        </div>
        <div class="row">
          <p>
            <label style="text-align: center">传真</label>
            <input ref="company_fax" type="text" value="{user.company_fax}">
          </p>
          <p>
            <label>电子邮箱</label>
            <input ref="email" type="text" value="{user.email}">
          </p>
        </div>
        <div class="row">
          <p>
            <label style="text-align: center">微信号</label>
            <input ref="we_chat" type="text" value="{user.we_chat}">
          </p>
          <p>
            <label style="text-align: center">QQ</label>
            <input ref="qq" type="text" value="{user.qq}">
          </p>
        </div>
      </div>
      <div class="row c4">
        <p style="width: 100%">
          <label>通讯地址</label>
          <input ref="address" type="text"  value="{user.address}" style="width: 71.5%">
        </p>
      </div>
      <div class="c1">
        <label class="top">获奖条件说明</label>
        <p>
          <textarea ref="profile">{user.profile}</textarea>
        </p>
      </div>
      <div class="c1 btn-line">
        <button type="button" onclick={fn.save} class="btn-yellow">{app.lang.admin.btn.save}</button>
        <button type="button" onclick={fn.cancel} class="btn-gray">{app.lang.admin.btn.back}</button>
      </div>
    </form>
  </section>

  <script>
  var _this = this;
  _this.user = {};
  _this.uid = _this.app.route.params[2];
  _this.fn = {
    cancel: function(){
      history.back();
    },
    save: function(e){
      var api = 'user-manager/default/create';
      if(_this.uid)
        api = 'user-manager/default/update?id=' + _this.uid;
      // 校验数据
      _this.app.validAll(_this.refs.validOnSave)
      .then(function(){
        // 确认密码校验
        if(_this.refs.confirm_password.value != _this.refs.password.value){
          _this.refs.validCFPassword.emit('check')
          .emit('msg', '确认密码与密码不一致');
          return _this.app.alert('请检查表单', 'warning');
        }
        _this.app.api('POST', api, {
          trigger: e.target,
          data: {
            data: JSON.stringify({
              address: _this.refs.address.value,
              company: _this.refs.company.value,
              company_fax: _this.refs.company_fax.value,
              company_tel: _this.refs.company_tel.value,
              password: _this.refs.password.value,
              confirm_password: _this.refs.confirm_password.value,
              donor_id: _this.refs.donor.getId(),
              email: _this.refs.email.value,
              is_manager: _this.refs.is_manager.checked?1:0,
              organization_id: _this.refs.organization.getId(),
              place_id: _this.refs.place.getId(),
              profile: _this.refs.profile.value,
              qq: _this.refs.qq.value,
              real_name: _this.refs.real_name.value,
              role_name: _this.refs.role.getName(),
              sex: _this.refs.sex.value,
              tel: _this.refs.tel.value,
              username: _this.refs.username.value,
              we_chat: _this.refs.we_chat.value
            })
          }
        }).on('done', function(){
          _this.app.alert('用户信息保存成功', 'success');
        });
      }).catch(function(){
        _this.app.alert('请检查表单', 'warning');
      });
    },
    getUserDetail: function(){
      // 获取用户帐号信息
      _this.app.api('GET', 'user-manager/default/update', {
        data: { id: _this.uid }
      }).on('done', function(data){
        _this.update({
          user: data
        });
        // 捐赠方
        _this.refs.donor.emit('set', {
          id: data.donor_id,
          name: data.donor_name
        });
        // 角色
        _this.refs.role.emit('set', {
          name: data.role_name,
          description: data.role_description
        });
        // 组织
        _this.refs.organization.trap('set', data.organization_id);
        // 职务
        _this.refs.place.emit('set', {
          id: data.place_id,
          name: data.place_name
        });
      });
    }
  };
  _this.on('mount', function(){
    if(_this.uid){
      _this.fn.getUserDetail();
    }
  });
  </script>
</user-form>


<fp-admin-user>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <user-form if={section=='add'}/>
      <user-form if={section=='edit'}/>
      <section if={section=='index'}>
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
              <th width="15%">姓名</th>
              <th width="10%">性别</th>
              <th width="20%">系统角色</th>
              <th width="10%">用户类型</th>
              <th width="15%">手机号</th>
              <th width="10%">注册时间</th>
              <th width="10%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>
              <td>{id}</td>
              <td>{real_name}</td>
              <td>{sex}</td>
              <td>{role_name||'-'}</td>
              <td>{is_manager==1?'管理员':'非管理员'}</td>
              <td>{tel||'-'}</td>
              <td>{app.utils.time2str(created_at)}</td>
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
  _this.section = _this.app.route.params[1] || 'index';
  _this.fn = {
    // 编辑用户
    edit: function(e){
      _this.app.route(_this.app.route.path + '/edit/' + e.item.id);
    },
    add: function(e){
      _this.app.route(_this.app.route.path + '/add/');
    },
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
    if(_this.section === 'index'){
      _this.fn.getUserList();
      _this.tags['pagination-number'].on('change', function(n){
        _this.q.page = n;
        _this.app.query();
      });
    }
  })
  </script>

</fp-admin-user>
