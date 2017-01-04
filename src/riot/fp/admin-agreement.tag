<!-- 协议表单内页 -->
<agreement-form>
  <section>
    <h2>
      管理后台 &gt;
      {app.lang.admin.agreement.title} &gt;
      {app.lang.admin.agreement[app.route.params[1]]}
    </h2>
    <form class="agreement">
      <span if={form.update_at} class="header-mark">
        最后更新:
        {form.update_at?app.utils.time2str(form.update_at):'-'} 操作人: {form.operator_user_name||'-'}
      </span>
      <h4>帐号信息</h4>
      <div class="c2">
        <div class="row">
          <p>
            <label>{app.lang.admin.agreement.number}</label>
            <input type="text" ref="agreement_number" value="{form.agreement_number}" placeholder="{app.lang.admin.form.req}">
            <input-valid ref="validOnSave" for="agreement_number" rule="required" msg="{app.lang.admin.agreement.number}{app.lang.admin.form.req}"/>
          </p>
          <p>
            <label>{app.lang.admin.agreement.name}</label>
            <input type="text" ref="agreement_name" value="{form.agreement_name}" placeholder="{app.lang.admin.form.req}">
            <input-valid ref="validOnSave" for="agreement_name" rule="required" msg="{app.lang.admin.agreement.name}{app.lang.admin.form.req}"/>
          </p>
        </div>
        <div class="row">
          <!-- 捐赠方 -->
          <p>
            <label>{app.lang.admin.agreement.donor}</label>
            <donor-select ref="donor"/>
          </p>
          <!-- 捐赠方性质 -->
          <p>
            <label>{app.lang.admin.agreement['donor:nature']}</label>
            <select ref="donor_nature">
              <option each={donorNature} value={key} selected="{form.donor_nature==key}">{name}</option>
            </select>
          </p>
        </div>
        <div class="row">
          <!-- 是否校友捐赠 -->
          <p>
            <label>{app.lang.admin.agreement.donations}</label>
            <label class="radio">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" name="alumni_donations" ref="alumni_donations" checked={form.alumni_donations==1}> {app.lang.yes}
            </label>
            <label class="radio">
              <input type="radio" name="alumni_donations" ref="alumni_donations" checked={form.alumni_donations==0}> {app.lang.no}
            <label>
          </p>
          <!-- 资金来源 -->
          <p>
            <label>{app.lang.admin.agreement['sources:funding']}</label>
            <select ref="sources_funding">
              <option each={sourcesFunding} value="{key}" selected="{form.sources_funding==key}">{name}</option>
            </select>
          </p>
        </div>
        <div class="row">
          <!-- 签约日期 -->
          <p>
            <label>{app.lang.admin.agreement.contract}</label>
            <input ref="contract_date" class="date" type="text" onclick="WdatePicker()" placeholder="{app.lang.admin.form.req}"
            value="{form.contract_date && app.utils.time2str(form.contract_date, {sp:'-'})}">
            <i class="icon-calendar"></i>
            <input-valid ref="validOnSave" for="contract_date" rule="required" msg="请选择日期"/>
          </p>
          <!-- 期限 -->
          <p>
            <label>{app.lang.admin.agreement.deadline}</label>
            <input ref="deadline" type="text" value="{form.deadline}" placeholder="{app.lang['year:number']}">
            <input-valid ref="validOnSave" for="deadline" rule="+int" msg="格式错误"/>
          </p>
        </div>
        <div class="row">
          <!-- 截止日期 -->
          <p>
            <label>{app.lang.admin.agreement.due}</label>
            <input ref="due_date" class="date" type="text" onclick="WdatePicker()" placeholder="{app.lang.admin.form.req}"
            value="{form.due_date && app.utils.time2str(form.due_date, {sp:'-'})}">
            <i class="icon-calendar"></i>
            <input-valid ref="validOnSave" for="due_date" rule="required" msg="请选择日期"/>
          </p>
          <p>
          </p>
        </div>
      </div>
      <hr>
      <br>
      <h4>捐赠信息</h4>
      <br>
      <!-- 项目类型 -->
      <div class="c1">
        <label class="top" style="padding-top: 10px">{app.lang.admin.agreement['project:type']}</label>
        <div class="line">
          <label style="width: 120px" each={projectType} class="checkbox">
            <input type="checkbox" value="{id}" ref="projectType" checked="{fn.checkProjectType(id)}">
            {name}
          </label>
        </div>
      </div>
      <!-- 货币捐赠 -->
      <div class="c1">
        <label class="top">货币捐赠</label>
        <div class="line">
          <p each={p in form.price} class="price-group">
            <select placehoder="货币种类" disabled>
              <option each={c in currencyList} value="{c[0]}" selected="{c[0]==p.currency_sign}">{c[1]}</option>
            </select>
            <input type="text" placeholder="金额" value={p.amount} disabled>
            <a href="javascript:;" onclick="{fn.removePrice}">
              <i class="icon-cancel"/>
            </a>
          </p>
          <p class="price-group">
            <select ref="addPriceType" placehoder="货币种类">
              <option each={c in currencyList} value="{c[0]}">{c[1]}</option>
            </select>
            <input type="text" ref="addPriceNumber" placeholder="金额">
            <a href="javascript:;" onclick="{fn.addPrice}">
              <i class="icon-plus"/>
            </a>
            <input-valid ref="validPrice" for="addPriceNumber" rule="required,number" msg="金额必须为数字"></input-valid>
          </p>
        </div>
      </div>
      <!-- 获奖条件说明 -->
      <div class="c1">
        <label class="top">获奖条件说明</label>
        <p>
          <textarea ref="award_condition">{form.award_condition}</textarea>
        </p>
      </div>
      <hr>
      <br>
      <h4>附属信息</h4>
      <br>
      <div class="c2">
        <div class="row">
          <label class="top">附件上传</label>
          <p>
            <upload-formdata name="file[]"></upload-formdata>
            &nbsp;&nbsp;<span style="font-size: 12px; color: #ccc">{fileUploadPercent}</span>
          </p>
          <p>
            <span class="files" each={form.file}>
              <a href="javascript:;" onclick="{fn.removeFile}">
                <i style="margin-left: 0" class="icon-cancel"></i>
              </a>
              {file_name}
            </span>
          </p>
        </div>
      </div>
      <div class="c1">
        <label class="top">协议录入人</label>
        <p>
          <input type="text" ref="user_name" value="{form.user_name||app.data.user_name}" disabled>
        </p>
      </div>
      <div class="c1">
        <label class="top">协议备注</label>
        <p>
          <textarea ref="remark">{form.remark}</textarea>
        </p>
      </div>
      <hr>
      <div class="c1 btn-line">
        <button type="button" onclick={fn.save} class="btn-yellow">{app.lang.admin.btn.save}</button>
        <button type="button" onclick={fn.cancel} class="btn-gray">{app.lang.admin.btn.back}</button>
      </div>
    </form>
  </section>
  <script>
  var _this = this;
  _this.form = {
    price: [],
    file: [],
    donor: {}
  };
  _this.cache = {};
  _this.donorNature = _this.app.lang.admin.agreement['donor:nature:list'];
  _this.sourcesFunding = _this.app.lang.admin.agreement['sources:funding:list'];
  _this.projectType = [];
  _this.fn = {
    save: function(e){
      // 检查信息
      _this.app.validAll(
        _this.refs.validOnSave.concat(_this.refs.donor)
      ).then(function(){
        // 检测通过, 整理数据
        var api, alumni_donations, project_type = [],
        promise = _this.app.Promise.resolve(true);
        if(_this.refs.alumni_donations[0].checked){
          alumni_donations = 1
        }
        if(_this.refs.alumni_donations[1].checked){
          alumni_donations = 0
        }
        _this.refs.projectType.forEach(function(target){
          if(target.checked) project_type.push({
            project_types_id: target.value
          });
        });
        if(_this.form.id){
          api = 'agreement/default/update?id='+_this.form.id;
        }
        else{
          api = 'agreement/default/create';
        }
        if(_this.refs.addPriceNumber.value){
          promise = _this.fn.addPrice();
        }
        promise.then(function(){
          _this.app.api('POST', api, {
            trigger: e.target,
            data: {
              data: JSON.stringify({
                agreement_number: _this.refs.agreement_number.value,
                agreement_name: _this.refs.agreement_name.value,
                donor_id: _this.refs.donor.getId(),
                deadline: parseInt(_this.refs.deadline.value, 10),
                contract_date: _this.app.utils.str2time(_this.refs.contract_date.value),
                due_date: _this.app.utils.str2time(_this.refs.due_date.value),
                award_condition: _this.refs.award_condition.value,
                donor_nature: _this.refs.donor_nature.value,
                alumni_donations: alumni_donations,
                sources_funding: _this.refs.sources_funding.value,
                remark: _this.refs.remark.value,
                file: _this.form.file || [],
                price: _this.form.price || [],
                project_type: project_type
              })
            }
          }).on('done', function(){
            _this.app.alert('协议保存成功', 'success');
            // 跳转到列表
            !_this.form.id && _this.app.route('admin-agreement');
          });
        });
      }).catch(function(){
        // 失败alert
        _this.app.alert('保存前请检查您的表单数据', 'warning');
      });
    },
    removeFile: function(e){
      _this.form.file.splice(_this.form.file.indexOf(e.item), 1);
    },
    cancel: function(){
      history.back();
    },
    // 勾选已经选中的项目类型
    checkProjectType: function(id){
      var checked = false;
      if(!_this.form.project_type) return; // 避免没数据的时候报错
      _this.form.project_type.forEach(function(item){
        if(item.project_types_id == id) checked = true;
      });
      return checked;
    },
    removePrice: function(e){
      _this.form.price.splice(_this.form.price.indexOf(e.item.p), 1);
    },
    addPrice: function(e){
      return new _this.app.Promise(function(resolve){
        _this.refs.validPrice
        .once('valid', function(){
          _this.form.price.push({
            currency_sign: _this.refs.addPriceType.value,
            amount: Number(_this.refs.addPriceNumber.value)
          });
          _this.refs.addPriceNumber.value = '';
          _this.refs.addPriceType.value = 'CNY';
          _this.update();
          resolve();
        }).emit('check');
      });
    },
    currencyCode: function(){
      // 货币种类
      _this.app.api('GET', 'agreement/default/currency-code')
      .on('done', function(data){
        _this.update({
          currencyList: data.items
        });
      });
    }
  };
  _this.on('mount', function(){
    // 编辑状态下(/edit/id)
    if(_this.app.route.params[1] == 'edit'){
      _this.agreement_id = _this.app.route.params[2];
      if(!_this.agreement_id){
        _this.app.alert('协议id错误', 'error');
        return history.back();
      }
      // 查询协议
      _this.app.api('GET', 'agreement/default/update', {
        data: { id: _this.agreement_id }
      })
      .on('done', function(data){
        _this.form = data;
        // 一些二级属性避免报错
        _this.form.donor = data.donor || {};
        _this.form.file = data.file || [];
        _this.form.price = data.price || [];
        _this.form.project_type = data.project_type || [];
        // 设置捐赠方
        _this.refs.donor.emit('set', {
          id: _this.form.donor.id,
          name: _this.form.donor.donor_name
        });
        _this.update();
      });
    }
    // 加载日期选择
    _this.app.addResource('my97');
    // 货币种类信息
    _this.fn.currencyCode();
    // 项目类型
    _this.app.getProjectTypeList(function(data){
      _this.update({projectType: data});
    });
    // 附件上传
    _this.tags['upload-formdata'].on('post', function(fd){
      _this.app.api('POST', 'agreement/default/upload-file', {
        payload: true,
        showProgress: true,
        formdata: true,
        data: fd
      }).on('done', function(data){
        _this.form.file = _this.form.file.concat(data.items);
        _this.update();
      })
      .on('progress', function(percent){
        _this.update({
          fileUploadPercent: percent == 100 ? '上传完毕': percent+'%'
        });
      });
    });
  });
  </script>
</agreement-form>






















<!-- 协议列表页面 -->
<fp-admin-agreement>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <agreement-form if={section=='add'}/>
      <agreement-form if={section=='edit'}/>
      <!-- 列表页面 -->
      <section if={section=='index'}>
        <h2>管理后台 &gt; {app.lang.admin.agreement.title}</h2>
        <table-filter for="agreement">
          <yield to="addon">
            <button class="main" onclick={parent.fn.add}>
              <i class="icon-plus"></i> {app.lang.admin.agreement.add}
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


      <footer class="admin"></footer>
    </div>
  </main>

  <!-- 删除记录弹窗 -->
  <modal-confirm type="delete"/>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.section = _this.app.route.params[1] || 'index';
  _this.fn = {
    add: function(){
      _this.app.route(_this.app.route.path + '/add');
    },
    edit: function(e){
      _this.app.route(_this.app.route.path + '/edit/' + e.item.id);
    },
    remove: function(e){
      _this.tags['modal-confirm']
      .emit('open').once('ok', function(){
        _this.app.api('GET', 'agreement/default/delete', {
          data: { id: e.item.id }
        }).on('done', function(){
          _this.app.alert('协议删除成功', 'success');
          _this.fn.getList();
        })
      });
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
          page: _this.q.page || 1,
          search_type: _this.q.type || '',
          search_keyword: _this.q.keyword || ''
        }
      }).on('done', function(data){
        // _this.app.log('api agreement done');
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
  _this.on('mount', function(){
    if(_this.section === 'index'){
      _this.fn.getList();
      _this.tags['pagination-number'].on('change', function(n){
        _this.q.page = n;
        _this.app.query();
      });
    }
  });
  </script>

</fp-admin-agreement>
