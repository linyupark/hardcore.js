<!-- 捐赠方表单页 -->
<donor-form>

  <section>
    <h2>
      管理后台 &gt;
      {app.lang.admin.donor.title} &gt;
      {app.lang.admin.donor[app.route.params[1]]}
    </h2>
    <form class="donor">
      <!-- 基本信息 -->
      <h4>{app.lang.admin.donor.baseinfo}</h4>
      <div class="c2">
        <div class="row">
          <!-- 捐赠方 -->
          <p>
            <label>{app.lang.admin.donor.name}*</label>
            <input type="text" ref="donor_name" value="{form.donor_name}" placeholder="{app.lang.admin.form.req}">
            <input-valid ref="validOnSave" for="donor_name" rule="required" msg="{app.lang.admin.donor.name}{app.lang.admin.form.req}"/>
          </p>
          <!-- 类型 -->
          <p>
            <label>{app.lang.admin.donor.type}</label>
            <select ref="donor_type">
              <option each={donorNature} value={key} selected="{form.type==key}">{name}</option>
            </select>
          </p>
        </div>
        <div class="row">
          <!-- 单位名称 -->
          <p>
            <label>{app.lang.admin.donor.company}</label>
            <input type="text" ref="company" value="{form.company}" placeholder="">
          </p>
          <!-- 单位地址 -->
          <p>
            <label>{app.lang.admin.donor.address}</label>
            <input type="text" ref="address" value="{form.address}" placeholder="">
          </p>
        </div>
        <div class="row">
          <!-- 电话 -->
          <p>
            <label>{app.lang.admin.donor.tel}</label>
            <input type="text" ref="tel" value="{form.tel}" placeholder="">
          </p>
          <!-- 邮箱 -->
          <p>
            <label>{app.lang.admin.donor.email}</label>
            <input type="text" ref="email" value="{form.email}" placeholder="">
            <input-valid ref="validOnSave" for="email" rule="email" msg="检查{app.lang.admin.donor.email}格式"/>
          </p>
        </div>
        <div class="row">
          <!-- 网站 -->
          <p>
            <label>{app.lang.admin.donor.website}</label>
            <input type="text" ref="website" value="{form.website}" placeholder="">
          </p>
          <!-- 微博 -->
          <p>
            <label>{app.lang.admin.donor.weibo}</label>
            <input type="text" ref="weibo" value="{form.weibo}" placeholder="">
          </p>
        </div>
      </div>
      <!-- 负责人 -->
      <div class="row">
        <p>
          <label>{app.lang.admin.donor.head}</label>
          <input type="text" ref="head" value="{form.head}" placeholder="{app.lang.admin.donor['head:name']}">
          &nbsp;
          <input type="text" ref="head_tel" value="{form.head_tel}" placeholder="{app.lang.admin.donor.tel}">
          <input-valid ref="validOnSave" for="head,head_tel" rule="required" msg="请填写负责人姓名跟联络电话"/>
        </p>
      </div>
      <!-- 联络人 -->
      <div class="row">
        <p>
          <label>{app.lang.admin.donor.contact}</label>
          <input type="text" ref="contact" value="{form.contact}" placeholder="{app.lang.admin.donor['operator:name']}">
          &nbsp;
          <input type="text" ref="contact_tel" value="{form.contact_tel}" placeholder="{app.lang.admin.donor.tel}">
          <input-valid ref="validOnSave" for="contact,contact_tel" rule="required" msg="请填写联络人姓名跟联络电话"/>
        </p>
      </div>
      <hr>
      <br>
      <!-- 成员信息 -->
      <h4>{app.lang.admin.donor.members}</h4>
      <br>
      <div class="row c4" each={m, i in form.donor_member}>
        <p>
          <label>成员{i+1}</label>
          <input type="text" value="{m.username}" disabled>
          &nbsp;
          <!-- 职务 -->
          <input type="text" value="{m.place_name}" disabled>
          &nbsp;
          <input type="text" value="{m.tel}" disabled>
          &nbsp;
          <input type="text" value="{m.email}" disabled>
          <a href="javascript:;" onclick={fn.removeMember} class="c-tooltips--top" aria-label="移除">
            <i class="icon-trash"></i>
          </a>
        </p>
      </div>
      <div class="row c4">
        <p>
        <label>成员{form.donor_member.length+1}</label>
        <input type="text" ref="member_username" placeholder="姓名">
        &nbsp;
        <!-- 职务 -->
        <place-select ref="member_place" left="255"/>
        &nbsp;
        <input type="text" ref="member_tel" placeholder="电话">
        &nbsp;
        <input type="text" ref="member_email" placeholder="邮箱">
        <a href="javascript:;" onclick={fn.addMember} class="c-tooltips--top" aria-label="添加">
          <i class="icon-plus"></i>
        </a>
        <input-valid ref="validOnAddMember" for="member_username,member_tel" rule="required" msg="请填写该成员的姓名、电话"/>
        <input-valid style="left: 625px" ref="validOnAddMember" for="member_email" rule="email" msg="邮箱格式不正确"/>
        </p>
      </div>
      <hr>
      <br>
      <div class="c1 btn-line">
        <button type="button" onclick={fn.save} class="btn-yellow">{app.lang.admin.btn.save}</button>
        <button type="button" onclick={fn.cancel} class="btn-gray">{app.lang.admin.btn.back}</button>
      </div>

      <br><br>
      <br><br>
    </form>
  </section>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.form_id = _this.app.route.params[2] || 0;
  _this.donorNature = _this.app.lang.admin.agreement['donor:nature:list'];
  _this.form = {
    donor_member: []
  };
  _this.fn = {
    // 保存
    save: function(e){
      _this.app.validAll(_this.refs.validOnSave)
      .then(function(){
        var api,
        promise = _this.app.Promise.resolve(true);
        if(_this.form_id > 0){
          api = 'donor/default/update?id=' + _this.form_id;
        }
        else{
          api = 'donor/default/create';
        }
        if(_this.refs.member_username.value){
          // 有成员信息则需要校验
          promise = _this.fn.addMember();
        }
        promise.then(function(){
          _this.app.api('POST', api, {
            trigger: e.target,
            data: {
              data: JSON.stringify({
                donor_name: _this.refs.donor_name.value,
                type: _this.refs.donor_type.value,
                company: _this.refs.company.value,
                address: _this.refs.address.value,
                tel: _this.refs.tel.value,
                email: _this.refs.email.value,
                website: _this.refs.website.value,
                weibo: _this.refs.weibo.value,
                head: _this.refs.head.value,
                head_tel: _this.refs.head_tel.value,
                contact: _this.refs.contact.value,
                contact_tel: _this.refs.contact_tel.value,
                donor_member: _this.form.donor_member
              })
            }
          })
          .on('done', function(data){
            _this.app.alert('捐赠方信息保存成功', 'success');
            // 跳转到列表
            !_this.form_id && _this.app.route('admin-donor');
          });
        });
      })
      .catch(function(){
        _this.app.alert('请检查提交表单的信息', 'warning');
      });
    },
    // 返回
    cancel: function(){
      history.back();
    },
    // 移除成员
    removeMember: function(e){
      _this.form.donor_member.splice(
        _this.form.donor_member.indexOf(e.item.m), 1
      );
    },
    // 增加成员
    addMember: function(){
      return new _this.app.Promise(function(resolve, reject){
        // 检查信息
        _this.app.validAll(
          _this.refs.validOnAddMember.concat(_this.refs.member_place)
        )
        .then(function(){
          _this.form.donor_member.push({
            username: _this.refs.member_username.value,
            place_id: _this.refs.member_place.getId(),
            place_name: _this.refs.member_place.getName(),
            tel: _this.refs.member_tel.value,
            email: _this.refs.member_email.value
          });
          _this.refs.member_place.emit('set', {
            id: '', name: ''
          });
          _this.refs.member_username.value =
          _this.refs.member_tel.value =
          _this.refs.member_email.value = '';
          _this.update();
          resolve();
        }).catch(function(){
          reject();
        });
      });
    },
    // 获取捐赠方信息
    getDonor: function(id){
      _this.app.api('GET', 'donor/default/update', {
        data: {id: id}
      }).on('done', function(data){
        _this.form = data;
        _this.update();
      });
    }
  };
  _this.on('mount', function(){
    if(_this.form_id){
      _this.fn.getDonor(_this.form_id);
    }
  });
  </script>
</donor-form>


<fp-admin-donor>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <donor-form if={section=='add'}/>
      <donor-form if={section=='edit'}/>
      <!-- 列表页面 -->
      <section if={section=='index'}>

        <h2>
          管理后台 &gt;
          {app.lang.admin.donor.title}</h2>

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
              <td>{app.getNatureName(type)}</td>
              <td>{contact||'-'}</td>
              <td>{contact_tel||'-'}</td>
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
      .emit('open').once('ok', function(){
        _this.app.api('GET', 'donor/default/delete', {
          data: { id: e.item.id }
        }).on('done', function(){
          _this.app.alert('捐赠方删除成功', 'success');
          _this.fn.getList();
        })
      });
    },
    add: function(){
      _this.app.route(_this.app.route.path + '/add');
    },
    edit: function(e){
      _this.app.route(_this.app.route.path + '/edit/' + e.item.id);
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
