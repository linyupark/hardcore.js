<!-- 协议表单内页 -->
<agreement-form>
  <section>
    <h2>{app.lang.admin.agreement.add}</h2>
    <form class="agreement" onsubmit="return false;">
      <h4>帐号信息</h4>
      <div class="c2">
        <div class="row">
          <p>
            <label>{app.lang.admin.agreement.number}</label>
            <input type="text" ref="number" placeholder="{app.lang.admin.form.req}">
          </p>
          <p>
            <label>{app.lang.admin.agreement.name}</label>
            <input type="text" ref="agreement_name" placeholder="{app.lang.admin.form.req}">
          </p>
        </div>
        <div class="row">
          <p>
            <label class="center">{app.lang.admin.agreement.donor}</label>
            <input-select name="donor_name" placehoder={app.lang.admin.agreement['donor:select']} value="{form.donor_name}"></input-select>
          </p>
          <p>
            <label>{app.lang.admin.agreement['donor:nature']}</label>
            <select ref="donor_nature">
              <option each={donorNature} value={key} selected={key==form.donor_nature}>{name}</option>
            </select>
          </p>
        </div>
        <div class="row">
          <p>
            <label>{app.lang.admin.agreement.donations}</label>
            <label class="radio">
              <input type="radio" name="alumni_donations" ref="alumni_donations" checked={form.alumni_donations==1}> {app.lang.yes}
            </label>
            <label class="radio">
              <input type="radio" name="alumni_donations" ref="alumni_donations" checked={form.alumni_donations==0}> {app.lang.no}
            <label>
          </p>
          <p>
            <label>{app.lang.admin.agreement['sources:funding']}</label>
            <select ref="sources_funding">
              <option each={sourcesFunding} value={key} selected={key==form.sources_funding}>{name}</option>
            </select>
          </p>
        </div>
        <div class="row">
          <p>
            <label>{app.lang.admin.agreement.contract}</label>
            <input ref="contract_date" class="date" type="text" onclick="WdatePicker()" placeholder="{app.lang.admin.form.req}">
            <i class="icon-calendar"></i>
          </p>
          <p>
            <label>{app.lang.admin.agreement.deadline}</label>
            <input ref="deadline" type="text" placeholder="{app.lang['year:number']}">
          </p>
        </div>
        <div class="row">
          <p>
            <label>{app.lang.admin.agreement.due}</label>
            <input ref="due_date" class="date" type="text" onclick="WdatePicker()" placeholder="">
            <i class="icon-calendar"></i>
          </p>
          <p>
          </p>
        </div>
      </div>
      <hr>
      <h4>捐赠信息</h4>
      <div class="c1">
        <label class="top">项目类型</label>
        <div class="line">
          <label style="width: 120px" each={projectType} class="checkbox">
            <input type="checkbox" value="{key}">
            {name}
          </label>
        </div>
      </div>
    </form>
  </section>
  <script>
  var _this = this;
  _this.form = {};
  _this.cache = {};
  _this.donorNature =  _this.app.lang.admin.agreement['donor:nature:list'];
  _this.sourcesFunding =  _this.app.lang.admin.agreement['sources:funding:list'];
  _this.projectType =  _this.app.lang.admin.agreement['project:type:list'];
  _this.fn = {
    donorList: function(keyword){
      if(_this.cache[keyword]){
        return _this.tags['input-select'].emit('push', _this.cache[keyword]);
      }
      // 获取捐赠方列表
      _this.app.api('GET', 'donor/default/search', {
        data: {
          keyword: keyword
        }
      }).then(function(data){
        _this.cache[keyword] = data.items;
        _this.tags['input-select'].emit('push', data.items);
      });
    }
  };
  _this.on('mount', function(){
    // 加载日期选择
    _this.app.addResource('my97');
    // 请求捐赠方数据
    _this.tags['input-select'].on('pull', _this.fn.donorList);
    // 选择了捐赠方
    _this.tags['input-select'].on('select', function(item){
      // _this.app.log('donor select:', item);
      _this.form.donor_id = item.id;
      _this.form.donor_name = item.donor_name;
    });
  });
  </script>
</agreement-form>


<!-- 协议列表页面 -->
<fp-admin-agreement>

  <header for="admin"></header>

  <div class="body admin">

    <div class="wrapper">
      <side-nav></side-nav>
      <agreement-form if={section=='add'}></agreement-form>
      <agreement-form if={section=='edit'}></agreement-form>
      <!-- 列表页面 -->
      <section if={section=='index'}>
        <h2>{app.lang.admin.agreement.title}</h2>
        <table-filter for="agreement">
          <yield to="addon">
            <button class="primary-btn" onclick={parent.fn.add}>
              + {app.lang.admin.agreement.add}
            </button>
          </yield>
        </table-filter>
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
            <tr if={!tableList}>
              <td colspan="6"><spinner-dot/></td>
            </tr>
          </tbody>
          <tfoot if={tableList}>
            <tr>
              <td colspan="6">
                {app.lang.admin.counts.items}
                <b>{items}</b>
                {app.lang.admin.counts.unit}
              </td>
            </tr>
          </tfoot>
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
  _this.section = _this.app.route.params[1] || 'index';
  _this.fn = {
    add: function(){
      _this.app.route(_this.app.route.path + '/add');
    },
    edit: function(e){
      _this.app.emit('animation', e.target, 'shake');
      _this.app.emit('message::header', _this.app.lang.admin.deny, 'error');
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
          pages: data.counts.total_page,
          items: data.counts.total_items
        });
      });
    }
  };
  _this.on('mount', function(){
    if(_this.section === 'index'){
      _this.page = _this.q.page || 1;
      _this.pages = 10;
      _this.tags['pagination-number'].on('page', function(page){
        _this.q.page = page;
        _this.app.query();
      });
      _this.fn.getList();
    }

  });
  </script>

</fp-admin-agreement>
