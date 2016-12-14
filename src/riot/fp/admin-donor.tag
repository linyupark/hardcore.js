<!-- 捐赠方表单页 -->
<donor-form>

  <section>
    <h2>
      {app.lang.admin.donor.title} &gt;
      {app.lang.admin.donor[app.route.params[1]]}
    </h2>
    <form class="donor" onsubmit="return false;">
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
              <option each={donorNature} selected={key==form.type}  value={key}>{name}</option>
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
        </p>
      </div>
      <!-- 联络人 -->
      <div class="row">
        <p>
          <label>{app.lang.admin.donor.operator}</label>
          <input type="text" ref="operator" value="{form.operator}" placeholder="{app.lang.admin.donor['operator:name']}">
          &nbsp;
          <input type="text" ref="operator_tel" value="{form.operator_tel}" placeholder="{app.lang.admin.donor.tel}">
        </p>
      </div>
      <hr>
      <br>
      <!-- 成员信息 -->
      <h4>{app.lang.admin.donor.members}</h4>
      <br>
    </form>
  </section>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.form_id = _this.app.route.params[2] || 0;
  _this.donorNature = _this.app.lang.admin.agreement['donor:nature:list'];
  _this.form = {};
  _this.fn = {
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
    add: function(){

    },
    edit: function(e){
      _this.app.route(_this.app.route.path + '/edit/' + e.item.id);
    },
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
