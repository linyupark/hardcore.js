<!-- 项目历史 -->
<project-history>
  <section>
    <h2>
      管理后台 &gt;
      {app.lang.admin.project.title} &gt; 项目执行历史
    </h2>
    <table class="base">
      <thead>
        <tr>
          <th width="10%">序号</th>
          <th width="10%">项目编号</th>
          <th width="50%">名称</th>
          <th width="20%">项目起止日期</th>
          <th width="10%">{app.lang.admin.handle}</th>
        </tr>
      </thead>
      <tbody>
        <tr each={tableList}>
          <td>{id}</td>
          <td>{project_number}</td>
          <td>{project_name}</td>
          <td>{app.utils.time2str(created_at)} ~ {finished_at?app.utils.time2str(finished_at):'未结束'}</td>
          <td><a href="#!admin-project/view/{parent.pid}?id={id}" class="under-line">查看详情</a></td>
        </tr>
        <tr if={!tableList}>
          <td colspan="5"><spinner-dot/></td>
        </tr>
      </tbody>
      <tfoot if={tableList}>
        <tr>
          <td class="left" colspan="5">
            {app.lang.admin.counts.items}
            <b>{items}</b>
            {app.lang.admin.counts.unit}
          </td>
        </tr>
      </tfoot>
    </table>
    <pagination-number page={page} pages={pages} select="y"/>
  </section>
  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.pid = _this.app.route.params[2];
  _this.fn = {
    getHistory: function(){
      _this.app.api('GET', 'project/default/history', {
        data: {
          page: _this.q.page || 1,
          id: _this.pid
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
  _this.on('mount', function(){
    _this.fn.getHistory();
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
  });
  </script>
</project-history>


<!-- 项目详情 -->
<project-view>
  <section>
    <h2>
      管理后台 &gt;
      {app.lang.admin.project.title} &gt; 项目详细
    </h2>
    <div class="project-view">
      <span class="header-mark">
        项目起止日期:
        {project.perform.created_at?app.utils.time2str(project.perform.created_at):'未开始'} ~ {project.perform.finished_at?app.utils.time2str(project.perform.finished_at):'未结束'}
      </span>
      <h4>基本信息</h4>
      <div class="c2">
        <div class="row">
          <p>
            <label>项目名称:</label>
            {project['base-info'].name}
          </p>
          <p>
            <label>项目编号:</label>
            {project['base-info'].number}
          </p>
        </div>
        <div class="row">
          <p>
            <label>项目类型:</label>
            {project['base-info'].project_types_name}
          </p>
          <p>
            <label>项目状态:</label>
            <span class="txt-success">{app.getProjectStatus(project['base-info'].status)}</span>
          </p>
        </div>
        <div class="row">
          <p>
            <label>项目总金额:</label>
            {project['base-info'].amount}
          </p>
          <p>
            <label>公开项目:</label>
            {project['base-info'].is_public==1?'是':'否'}
          </p>
        </div>
      </div>
      <div class="c1">
        <label>项目简介:</label>
        <p>
          {project['base-info'].description}
        </p>
      </div>
      <br>
      <hr>
      <h4>执行信息</h4>
      <div class="c1">
        <label>执行单位:</label>
        <p>
          {project.performer.organization_name}
        </p>
      </div>
      <div class="c2">
        <div class="row">
          <p>
            <label>单位负责人:</label>
            {project.performer.head_name}
          </p>
          <p>
            <label>联系电话:</label>
            {project.performer.head_tel}
          </p>
        </div>
        <div class="row">
          <p>
            <label>项目联络人:</label>
            {project.performer.contact_name}
          </p>
          <p>
            <label>联系电话:</label>
            {project.performer.contact_tel}
          </p>
        </div>
      </div>
      <br>
      <hr>
      <div each={ag, i in project.agreement}>
        <h4>项目关联协议({i+1})</h4>
        <div class="c2">
          <div class="row">
            <p>
              <label>协议名称:</label>
              {ag.agreement_name}
            </p>
            <p>
              <label>协议编号:</label>
              {ag.agreement_number}
            </p>
          </div>
          <div class="row">
            <p>
              <label>关联时间:</label>
              {app.utils.time2str(ag.create_date)}
            </p>
          </div>
        </div>
        <br>
        <hr>
      </div>
      <h4>到款状态</h4>
      <div class="c1">
        <label>是否已到款:</label>
        <p>
          {project.payment_status?'是':'否'}
        </p>
      </div>
      <br>
      <hr>
      <h4>项目执行</h4>
      <div class="row-step">
        <div class="step-box">
          <div class="step-num {active:project.perform.create_status==1}">1</div>
          <div class="step-line"></div>
          <div class="step-num {active:project.perform.payment_status==1}">2</div>
          <div class="step-line"></div>
          <div class="step-num {active:project.perform.review_status==1}">3</div>
          <div class="step-line"></div>
          <div class="step-num {active:project.perform.verify_status==1}">4</div>
          <div class="step-line"></div>
          <div class="step-num {active:project.perform.confirm_status==1}">5</div>
          <div class="step-line"></div>
          <div class="step-num {active:project.perform.issue_status==1}">6</div>
        </div>
        <div class="text-box">
          <p>立项</p>
          <p>确认到款</p>
          <p>录入评审结果</p>
          <p>项目部审核</p>
          <p>捐赠方确认</p>
          <p>发放完成</p>
        </div>
      </div>

      <br>
      <hr>
      <div class="c1 btn-line" style="text-indent: 0; text-align: center">
        <button type="button" onclick={fn.back} class="btn-gray">{app.lang.admin.btn.back}</button>
      </div>
    </div>
  </section>
  <script>
  var _this= this;
  _this.pid = _this.app.route.params[2];
  _this.pk_id = _this.app.route.query.id;
  _this.project = {
    'base-info': {},
    perform: {},
    performer: {},
    agreement: []
  };
  _this.fn = {
    back: function(){
      history.back();
    },
    getDetail: function(){
      _this.app.api('GET', 'project/default/view', {
        data: { id: _this.pid, pk_id: _this.pk_id }
      }).on('done', function(data){
        _this.update({
          project: data
        });
      });
    }
  };
  _this.on('mount', function(){
    _this.fn.getDetail();
  });
  </script>
</project-view>


<!-- 项目进度 -->
<project-perform>

  <div class="project-perform" if="{opts.pid>0}">
    <h2 class="title">{perform.project_name}项目执行</h2>
    <div style="overflow: hidden">
      <div class="step-box">
        <div each={p, i in perform.process}>
          <div class="step-num {active: p.status==1}">{i+1}</div>
          <div if="{i!=5}" class="step-line"/>
        </div>
      </div>
      <div class="process-list">
        <div class="line {odd:i%2==0}" each={p, i in perform.process}>
          <h4>{p.title}</h4>
          <p if={i==0}>
            创建即立项
            <span if={p.status==1 && !p.active}>执行中</span>
            <button type="button" if={p.active} onclick="{fn.create}" class="btn-main">开始执行</button>
          </p>
          <p if={i==1}>
            本项目已经到款金额{p.payment_sum}元
            <a if={p.status==1} href="javascript:;" onclick={fn.checkPayment} class="under-line">查看到款信息</a>
            <span if={p.status==1 && !p.active}>已确认</span>
            <button type="button" onclick={fn.CFPayment} if={p.status!=1||p.active} class="{'btn-gray':!p.active, 'btn-main':p.active}" disabled="{!p.active}">确认</button>
          </p>
          <p if={i==2}>
            由各执行单位（院系／机构／部门）录入评比结果
            <a if={p.status==1&&p.review_file.length>0} href="javascript:;" onclick="{fn.download}" class="under-line">下载评审结果</a>
            <span if={p.status==1&&!p.active&&p.review_file.length>0}>已上传</span>
            <upload-formdata changeupload="true" ref="upload" name="file[]" if={p.status!=1||p.active} btn="{p.review_file.length>0?'重新上传':'上传'}" disable="{!p.active}"/>
          </p>
          <p if={i==3}>
            由项目部对评审结果进行审批核实
            <span if={p.status==1 && !p.active}>已确认</span>
            <button type="button" if={p.status!=1||p.active} onclick="{fn.CFVerify}" class="{'btn-gray':!p.active, 'btn-main':p.active}" disabled="{!p.active}">确认</button>
          </p>
          <p if={i==4}>
            请导出评选结果，并发邮件给捐赠方确认
            <span if={p.status==1 && !p.active}>已确认</span>
            <button type="button" if={p.status!=1||p.active} onclick="{fn.CFDonor}" class="{'btn-gray':!p.active, 'btn-main':p.active}" disabled="{!p.active}">确认</button>
          </p>
          <p if={i==5}>
            <a href="javascript:;" class="under-line" onclick="{fn.history}">查看历史执行</a>
            <span if={p.status==1 && !p.active}>已确认</span>
            <button type="button" if={p.status!=1||p.active} onclick="{fn.CFIssue}" class="{'btn-gray':!p.active, 'btn-main':p.active}" disabled="{!p.active}">确认</button>
          </p>
        </div>
      </div>
    </div>
    <br><br>
  </div>
  <!-- 没有项目ID提示 -->
  <div class="warning-box" if="{opts.pid==0}">
    需要先创建项目后才能编辑此页
    <a href="#!{app.route.path}?tab=baseinfo">返回创建</a>
  </div>

  <script>
  var _this = this;
  _this.perform = {};
  _this.fn = {
    download: function(e){
      e.item.p.review_file.forEach(function(f){
        window.open(f.file_path);
      });
    },
    history: function(e){
      // 查看历史执行
      _this.app.route(_this.app.route.params[0]+'/history/'+_this.app.route.params[2]);
    },
    // 发放确认
    CFIssue: function(e){
      _this.app.api('POST', 'project/perform/issue?id='+opts.pid, {
        trigger: e.target
      })
      .on('done', function(data){
        _this.fn.getPerform(function(){
          _this.app.alert('发放确认成功', 'success');
        });
      });
    },
    // 捐赠方确认
    CFDonor: function(e){
      _this.app.api('POST', 'project/perform/confirm?id='+opts.pid, {
        trigger: e.target
      })
      .on('done', function(data){
        _this.fn.getPerform(function(){
          _this.app.alert('捐赠方确认成功', 'success');
        });
      });
    },
    // 审核确认
    CFVerify: function(e){
      _this.app.api('POST', 'project/perform/verify?id='+opts.pid, {
        trigger: e.target
      })
      .on('done', function(data){
        _this.fn.getPerform(function(){
          _this.app.alert('确认审核成功', 'success');
        });
      });
    },
    // 确认到账
    CFPayment: function(e){
      _this.app.api('POST', 'project/perform/payment?id='+opts.pid, {
        trigger: e.target
      })
      .on('done', function(data){
        _this.fn.getPerform(function(){
          _this.app.alert('确认到账成功', 'success');
        });
      });
    },
    // 新建开始执行
    create: function(e){
      _this.app.api('POST', 'project/perform/create?id='+opts.pid, {
        trigger: e.target
      })
      .on('done', function(data){
        _this.fn.getPerform(function(){
          _this.app.alert('创建立项成功', 'success');
        });
      });
    },
    checkPayment: function(){
      _this.app.route(_this.app.route.path + '?tab=payment');
    },
    getPerform: function(cb){
      _this.app.api('GET', 'project/perform/index', {
        data: { id: opts.pid }
      }).on('done', function(data){
        _this.perform = data;
        _this.update();
        cb && cb();
        // 检测上传
        _this.refs.upload && _this.refs.upload.once('post', function(fd){
          _this.app.api('POST', 'project/perform/review?id='+opts.pid, {
            payload: true,
            showProgress: true,
            formdata: true,
            data: fd
          }).on('done', function(data){
            _this.fn.getPerform(function(){
              _this.app.alert('上传成功', 'success');
              _this.refs.upload.emit('disable', false);
            });
          })
          .on('progress', function(percent){
            _this.refs.upload.emit('disable', true);
            _this.refs.upload.emit('setBtnText', percent == 100 ? '上传完毕': percent+'%');
          });
        });
      });
    }
  };
  _this.on('mount', function(){
    if(opts.pid === 0) return;
    _this.fn.getPerform();
  });
  </script>

</project-perform>


<!-- 到款记录 -->
<project-payment>
  <style scoped>
  .filter{
    text-align: right;
    border-bottom: 2px dotted #ebebeb;
    padding-bottom: 10px;
  }
  .filter button{ padding-right: 15px;}
  .payment-list{position: relative; }
  .animation{
    animation: fadeInDown .2s;
  }
  </style>
  <div class="project-payment" if="{opts.pid>0}">

    <div class="filter">
      <button type="button" class="btn-main" onclick={fn.addPayment}>
        <i class="icon-plus"></i> 添加记录
      </button>
    </div>

    <!-- 新建记录 -->
    <form if="{addMode}" class="payment {animation: addMode}">
      <h4>添加到款记录</h4>
      <div class="c2">
        <div class="row">
          <p>
            <label>到款金额(元):</label>
            <input ref="amount_0" type="text">
            <input-valid ref="validOnSave_0" rule="required" for="amount_0" msg="请填写到款金额">
          </p>
        </div>
        <div class="row">
          <p>
            <label>所属协议:</label>
            <agreement-select ref="agreement_name_0"/>
          </p>
          <p>
            <label>到款日期:</label>
            <input type="text" onclick="WdatePicker()" ref="pay_date_0" value="">
            <i class="icon-calendar"></i>
          </p>
        </div>
        <div class="row">
          <p>
            <label>记录人:</label>
            <input type="text" value="{app.data.user_name}">
          </p>
        </div>
      </div>
      <div class="c1 btn-line">
        <button type="button" onclick={fn.save} class="btn-yellow">{app.lang.admin.btn.save}</button>
        <button type="button" onclick={fn.cancel} class="btn-gray">{app.lang.admin.btn.cancel}</button>
      </div>
    </form>

    <form each="{payment, i in paymentList}" class="payment">
      <h4>到款记录 {i+1<10?'0'+(i+1):i+1}</h4>
      <p class="btn-line-top">
        <a href="javascript:;" aria-label="{app.lang.admin.handles.edit}" class="c-tooltip--top">
          <i onclick={fn.edit}  class="btn-icon icon-pencil"></i>
        </a>
        <a href="javascript:;" aria-label="{app.lang.admin.handles.remove}" class="c-tooltip--top">
          <i onclick={fn.remove}  class="btn-icon icon-trash"></i>
        </a>
      </p>
      <div class="c2">
        <div class="row">
          <p>
            <label>到款金额(元):</label>
            <span if="{!payment.editMode}">{payment.amount}</span>
            <input if="{payment.editMode}" ref="amount_{i+1}" type="text" value="{payment.amount}">
            <input-valid if="{payment.editMode}" ref="validOnSave_{i+1}" rule="required" for="amount_{i+1}" msg="请填写到款金额">
          </p>
        </div>
        <div class="row">
          <p>
            <label>所属协议:</label>
            <span if="{!payment.editMode}">{payment.agreement_name}</span>
            <agreement-select if="{payment.editMode}"  ref="agreement_name_{i+1}"/>
          </p>
          <p>
            <label>到款日期:</label>
            <span if="{!payment.editMode}">{app.utils.time2str(payment.pay_date)}</span>
            <input if="{payment.editMode}" type="text" onclick="WdatePicker()" ref="pay_date_{i+1}" value="{payment.pay_date && app.utils.time2str(payment.pay_date, {sp:'-'})}">
            <i if="{payment.editMode}" class="icon-calendar"></i>
          </p>
        </div>
        <div class="row">
          <p>
            <label>记录人:</label>
            <span if="{!payment.editMode}">{payment.operator_name}</span>
            <input if="{payment.editMode}" type="text" value="{app.data.user_name}">
          </p>
        </div>
      </div>
      <div class="c1 btn-line" if="{payment.editMode}">
        <button type="button" onclick={fn.save} class="btn-yellow">{app.lang.admin.btn.save}</button>
        <button type="button" onclick={fn.cancel} class="btn-gray">{app.lang.admin.btn.cancel}</button>
      </div>
    </form>

    <pagination-number page={page} pages={pages} select="y"/>

    <br><br><br><br>

  </div>

  <!-- 没有项目ID提示 -->
  <div class="warning-box" if="{opts.pid==0}">
    需要先创建项目后才能编辑此页
    <a href="#!{app.route.path}?tab=baseinfo">返回创建</a>
  </div>

  <!-- 没有到款记录提示 -->
  <div class="warning-box" if="{!addMode && paymentList&&paymentList.length==0}">
    该项目还没有到款记录，可点击右上方添加。
  </div>

  <!-- 删除记录 -->
  <modal-remove ref="rmmodal"/>

  <script>
  var _this = this;
  _this.fn = {
    // 删除
    remove: function(e){
      _this.refs.rmmodal.emit('open').once('ok', function(){
        _this.app.api('GET', 'project/payment/delete', {
          data: { id: opts.pid, pk_id: e.item.payment.id }
        }).on('done', function(){
          _this.app.alert('删除成功', 'success');
          _this.fn.getPaymentList();
        })
      });
    },
    // 添加协议
    addPayment: function(){
      _this.addMode = true;
    },
    // 保存编辑
    save: function(e){
      var p, api, i = 0;
      if(e.item && e.item.payment){
        i = (e.item.i+1);
        api = 'project/payment/update?id='+opts.pid+'&pk_id='+e.item.payment.id;
      }
      else{
        i = 0;
        api = 'project/payment/create?id='+opts.pid;
      }
      _this.app.validAll(
        [_this.refs['validOnSave_'+i], _this.refs['agreement_name_'+i]]
      ).then(function(){
        return _this.app.api('POST', api, {
          trigger: e.target,
          data: {
            data: JSON.stringify({
              amount: _this.refs['amount_'+i].value,
              agreement_id: _this.refs['agreement_name_'+i].getId(),
              pay_date: _this.app.utils.str2time(_this.refs['pay_date_'+i].value)
            })
          }
        }).on('done', function(){
          _this.fn.getPaymentList();
          e.item && delete e.item.payment.editMode;
          _this.addMode = false;
          _this.app.alert('保存成功', 'success');
        });
      }).catch(function(){
        _this.app.alert('表单有错误请检查', 'warning');
      });
    },
    // 取消编辑
    cancel: function(e){
      if(e.item && e.item.payment){
        delete e.item.payment.editMode;
      }
      else{
        _this.addMode = false;
      }
    },
    // 编辑到款记录
    edit: function(e){
      e.item.payment.editMode = true;
      _this.update();
      // 设置到款记录显示
      _this.refs['agreement_name_'+(e.item.i+1)]
      .emit('set', {
        id: e.item.payment.agreement_id,
        name: e.item.payment.agreement_name
      });
    },
    getPaymentList: function(){
      _this.app.api('GET', 'project/payment/index', {
        data: {id: opts.pid}
      }).on('done', function(data){
        _this.update({
          paymentList: data.items,
          page: data.counts.page,
          pages: data.counts.total_page,
          items: data.counts.total_items
        });
        _this.tags['pagination-number'].emit('render');
      });
    }
  };
  _this.on('mount', function(){
    if(opts.pid === 0) return;
    // 加载日期选择
    _this.app.addResource('my97');
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
    _this.fn.getPaymentList();
  });
  </script>
</project-payment>

<!-- 关联协议 -->
<project-agreement>

  <style scoped>
  .project-agreement table-filter div{
    margin: 0
  }
  </style>

  <div class="project-agreement" if="{opts.pid>0}">
    <table-filter for="project-agreement">
      <yield to="addon">
        <button type="button" class="main" onclick={parent.fn.modalAddAgreement}>
          <i class="icon-plus"></i> 添加关联协议
        </button>
      </yield>
    </table-filter>
    <br>
    <table class="base">
      <thead>
        <tr>
          <th width="10%">{app.lang.admin.agreement.id}</th>
          <th width="15%">{app.lang.admin.project.number}</th>
          <th width="50%">{app.lang.admin.agreement.name}</th>
          <th width="15%">关联日期</th>
          <th width="10%">{app.lang.admin.handle}</th>
        </tr>
      </thead>
      <tbody>
        <tr each={tableList}>
          <td>{id}</td>
          <td>{agreement_number}</td>
          <td class="left">{agreement_name}</td>
          <td>{app.utils.time2str(create_date)}</td>
          <td>
            <a href="javascript:;" aria-label="取消关联" class="c-tooltip--top">
              <i onclick={fn.remove} class="btn-icon icon-trash"></i>
            </a>
          </td>
        </tr>
        <tr if={!tableList}>
          <td colspan="5"><spinner-dot/></td>
        </tr>
      </tbody>
      <tfoot if={tableList}>
        <tr>
          <td class="left" colspan="5">
            {app.lang.admin.counts.items}
            <b>{items}</b>
            {app.lang.admin.counts.unit}
          </td>
        </tr>
      </tfoot>
    </table>
    <pagination-number page={page} pages={pages} select="y"/>
    <br><br><br>

  </div>

  <!-- 没有项目ID提示 -->
  <div class="warning-box" if="{opts.pid==0}">
    需要先创建项目后才能编辑此页
    <a href="#!{app.route.path}?tab=baseinfo">返回创建</a>
  </div>

  <!-- 关联协议弹窗 -->
  <modal-agreement pid="{opts.pid}" ref="agmodal"/>

  <!-- 取消关联弹窗 -->
  <modal-remove ref="rmmodal"/>

  <script>
  var _this = this;
  _this.fn = {
    remove: function(e){
      // 取消关联
      _this.refs.rmmodal.emit('open')
      .on('ok', function(){
        _this.app.api('GET', 'project/agreement/delete', {
          data: {
            pk_id: e.item.id,
            id: opts.pid
          }
        }).on('done', function(){
          _this.app.alert('取消关联成功', 'success');
          _this.fn.getAgreementList();
        });
      });
    },
    modalAddAgreement: function(){
      // 添加关联协议弹窗
      _this.refs.agmodal.emit('open');
    },
    getAgreementList: function(){
      // 通过GET来获取某个项目的协议数据，必需传入get参数?id=当前项目id。
      _this.app.api('GET', 'project/agreement/index', {
        data: {
          id: opts.pid
        }
      })
      .on('done', function(data){
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
    if(opts.pid > 0){
      _this.fn.getAgreementList();
    }
    // 添加关联成功了要刷新列表
    _this.refs.agmodal.on('added', function(){
      _this.fn.getAgreementList();
    });
  });
  </script>

</project-agreement>


<!-- 项目资料 -->
<project-form>
  <section>
    <h2>
      管理后台 &gt;
      {app.lang.admin.project.title} &gt;
      <span if={key==parent.formTab} each={formTabList}>{name}</span>
    </h2>
    <form class="project">
      <div class="top-tab-line">
        <a href="javascript:;" onclick={fn.tabChange} class="c4 {active: key==parent.formTab}" each={formTabList}>{name}</a>
      </div>
      <project-agreement if={formTab=='agreements'} pid="{project.id}" />
      <project-payment if={formTab=='payment'} pid="{project.id}" />
      <project-perform if={formTab=='perform'} pid="{project.id}" />
      <div if={formTab=='baseinfo'}>
        <h4>基本信息</h4>
        <div class="c2">
          <div class="row">
            <!-- 项目名称 -->
            <p>
              <label>{app.lang.admin.project.name}</label>
              <input type="text" ref="name" value="{project.baseinfo.name}" placeholder="{app.lang.admin.form.req}">
              <input-valid ref="validOnSave" for="name" rule="required" msg="{app.lang.admin.project.name}{app.lang.admin.form.req}"/>
            </p>
            <!-- 项目编号 -->
            <p>
              <label>{app.lang.admin.project.number}</label>
              <input type="text" ref="number" value="{project.baseinfo.number}" placeholder="{app.lang.admin.form.req}">
              <input-valid ref="validOnSave" for="number" rule="required" msg="{app.lang.admin.project.number}{app.lang.admin.form.req}"/>
            </p>
          </div>
          <div class="row">
            <!-- 项目类型 -->
            <p>
              <label>{app.lang.admin.project.type}</label>
              <project-type-select disable="{project.id>0?1:0}" ref="project_type"/>
            </p>
            <!-- 项目状态 -->
            <p>
              <label>{app.lang.admin.project.status}</label>
              <select ref="status">
                <option each={[{
                  "name": "已结束",
                  "key": 0
                }, {
                  "name": "执行中",
                  "key": 1
                }]} selected="{project.baseinfo.status==key}" value={key}>{name}</option>
              </select>
            </p>
          </div>
          <div class="row">
            <!-- 项目金额 -->
            <p>
              <label>{app.lang.admin.project.amount}</label>
              <input type="text" ref="amount" value="{project.baseinfo.amount}" placeholder="{app.lang.admin.form.req}">
              <input-valid ref="validOnSave" for="amount" rule="number" msg="{app.lang.admin.project.amount}{app.lang.admin.form.req}"/>
            </p>
            <!-- 是否公开 -->
            <p>
              <label>{app.lang.admin.project.isPublic}</label>
              <label class="radio">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" name="is_public" ref="is_public" checked={project.baseinfo.is_public==1}> {app.lang.yes}
              </label>
              <label class="radio">
                <input type="radio" name="is_public" ref="is_public" checked={project.baseinfo.is_public==0}>
                {app.lang.no}
              <label>
            </p>
          </div>
        </div>
        <!-- 项目简介 -->
        <div class="c1">
          <label class="top">项目简介</label>
          <p>
            <textarea ref="description">{project.baseinfo.description}</textarea>
          </p>
        </div>
        <hr>
        <br>
        <h4>执行信息</h4>
        <div class="row c4">
          <!-- 部门单位 -->
          <p>
            <label>部门单位</label>
            <org-select ref="organization"/>
          </p>
        </div>
        <div class="row c4">
          <!-- 负责人 -->
          <p>
            <label>负责人</label>
            <user-select ref="head_name" for="admin"/>
            &nbsp;
            <input type="text" ref="head_tel" placeholder="电话" value="{project.baseinfo.head_tel}">
            &nbsp;
            <input type="text" ref="head_email" placeholder="邮箱" value="{project.baseinfo.head_email}">
            <input-valid style="left: 245px" ref="validOnSave" for="head_tel,head_email" rule="required" msg="请填写负责人的电话、邮箱"/>
            <input-valid style="left: 445px" ref="validOnSave" for="head_email" rule="email" msg="邮箱格式不正确"/>
          </p>
        </div>
        <div class="row c4">
          <!-- 联络人 -->
          <p>
            <label>联络人</label>
            <input type="text" ref="contact_name" placeholder="姓名" value="{project.baseinfo.contact_name}">
            &nbsp;
            <input type="text" ref="contact_tel" placeholder="电话" value="{project.baseinfo.contact_tel}">
            &nbsp;
            <input type="text" ref="contact_email" placeholder="邮箱" value="{project.baseinfo.contact_email}">
            <input-valid ref="validOnSave" for="contact_name,contact_tel,contact_email" rule="required" msg="请填写联络人的姓名、电话、邮箱"/>
            <input-valid style="left: 445px" ref="validOnSave" for="contact_email" rule="email" msg="邮箱格式不正确"/>
          </p>
        </div>
        <hr>
        <br>
        <div class="c1 btn-line">
          <button type="button" onclick={fn.save} class="btn-yellow">{app.lang.admin.btn.save}</button>
          <button type="button" onclick={fn.cancel} class="btn-gray">{app.lang.admin.btn.back}</button>
        </div>
      </div>
    </form>
  </section>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  // 页面tab列表
  _this.formTabList = _this.app.lang.admin.project.formTab;
  // 当前tab（默认为列表第一页）
  _this.formTab = _this.q.tab || _this.formTabList[0].key;
  // 项目相关数据
  _this.project = {
    id: _this.app.route.params[2] || 0,
    baseinfo: {
      is_public: 1
    }
  };
  _this.fn = {
    save: function(e){
      // 修改添加基础信息
      if(_this.formTab === 'baseinfo'){
        _this.app.validAll(
          _this.refs.validOnSave.concat(
            _this.refs.project_type,
            _this.refs.organization,
            _this.refs.head_name
          )
        )
        .then(function(){
          if(_this.project.id > 0){
            api = 'project/default/base-info-update?id=' + _this.project.id;
          }
          else{
            api = 'project/default/base-info-create';
          }
          _this.app.api('POST', api, {
            trigger: e.target,
            data: {
              data: JSON.stringify({
                name: _this.refs.name.value,
                number: _this.refs.number.value,
                project_types_id: _this.refs.project_type.getId(),
                status: _this.refs.status.value,
                amount: _this.refs.amount.value,
                is_public: _this.refs.is_public[0].checked ? 1 : 0,
                description: _this.refs.description.value,
                organization_id: _this.refs.organization.getId(),
                contact_name: _this.refs.contact_name.value,
                contact_tel: _this.refs.contact_tel.value,
                contact_email: _this.refs.contact_email.value,
                head_name: _this.refs.head_name.getName(),
                head_uid: _this.refs.head_name.getId(),
                head_tel: _this.refs.head_tel.value,
                head_email: _this.refs.head_email.value
              })
            }
          }).on('done', function(data){
            _this.app.alert('项目资料保存成功', 'success');
            // 跳转到列表
            !_this.project.id && _this.app.route('admin-project');
          });
        })
        .catch(function(e){
          _this.app.alert('请检查表单', 'warning');
        });
      }
    },
    // 返回
    cancel: function(){
      _this.app.route(_this.app.route.params[0]);
    },
    tabChange: function(e){
      // 切换顶tab
      _this.q.tab = e.item.key;
      _this.app.query();
    }
  };
  _this.on('mount', function(){
    // 项目资料
    if(_this.formTab === 'baseinfo'){
      // 查询基本信息
      if(_this.project.id > 0){
        _this.app.api('GET', 'project/default/base-info', {
          data: { id: _this.project.id }
        }).on('done', function(data){
          _this.project.baseinfo = data;
          _this.update();
          // 确保refs能获取争取，设置少许延迟
          setTimeout(function(){
            _this.refs.project_type.emit('set', {
              id: data.project_types_id
            });
            _this.refs.head_name.emit('set', {
              id: data.head_uid,
              name: data.head_name
            });
            _this.refs.organization.emit('set', data.organization_id);
            _this.update();
          }, 100);
        });
      }
    }
  });
  </script>
</project-form>





<!-- 项目资料列表 -->
<fp-admin-project>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <project-view if={section=='view'}/>
      <project-history if={section=='history'}/>
      <project-form if={section=='add'}/>
      <project-form if={section=='edit'}/>
      <section if={section=='index'}>
        <h2>
          管理后台 &gt;
          {app.lang.admin.project.title}
        </h2>
        <!-- 我的项目、所有项目 -->
        <div class="table-tab">
          <a href="javascript:;" onclick={fn.filterRange} each={filterRange} class={active:q.range==key}>{name}</a>
        </div>
        <table-filter for="project">
          <yield to="addon">
            <button class="main" onclick={parent.fn.add}>
              <i class="icon-plus"></i> {app.lang.admin.project.add}
            </button>
          </yield>
        </table-filter>

        <table class="base">
          <thead>
            <tr>
              <th width="10%">{app.lang.admin.project.id}</th>
              <th width="10%">{app.lang.admin.project.number}</th>
              <th width="30%">{app.lang.admin.project.name}</th>
              <th width="10%">{app.lang.admin.project.type}</th>
              <th width="10%">{app.lang.admin.project.amount}</th>
              <th width="10%">{app.lang.admin.project.status}</th>
              <th width="10%">{app.lang.admin.project.createAt}</th>
              <th width="10%">{app.lang.admin.handle}</th>
            </tr>
          </thead>
          <tbody>
            <tr each={tableList}>
              <td>{id}</td>
              <td>{number}</td>
              <td class="left">{name}</td>
              <td>{app.getProjectType(project_types_id)}</td>
              <td>{amount}</td>
              <td>{app.getProjectStatus(status)}</td>
              <td>{createAt&&app.utils.time2str(createAt)||'-'}</td>
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



  <footer class="admin"></footer>

  <!-- 删除记录弹窗 -->
  <modal-remove/>

  <script>
  var _this = this;
  // 获取当前location.query
  _this.q = _this.app.route.query;
  // 默认列表页
  _this.section = _this.app.route.params[1] || 'index';
  // 项目过滤(我的、全部)
  _this.filterRange = _this.app.lang.admin.project['filter:range'];
  _this.fn = {
    remove: function(e){
      _this.tags['modal-remove']
      .emit('open').once('ok', function(){
        _this.app.api('GET', 'project/default/delete', {
          data: { id: e.item.id }
        }).on('done', function(){
          _this.app.alert('项目删除成功', 'success');
          _this.fn.getProjectList();
        })
      });
    },
    // 添加项目
    add: function(){
      _this.app.route(_this.app.route.path + '/add');
    },
    // 编辑项目
    edit: function(e){
      _this.app.route(_this.app.route.path + '/edit/' + e.item.id);
    },
    filterRange: function(e){
      _this.q.range = e.item.key;
      _this.app.query();
    },
    getProjectList: function(){
      // all: 全部、0已关闭、1执行中、2已到款、3已评审、4已审核、5已确认、6已发放
      _this.app.api('GET', 'project/default/' + _this.q.range, {
        data: {
          page: _this.q.page || 1,
          condition: _this.q.status == 'all' ? '' : _this.q.status
        }
      })
      .on('done', function(data){
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
      // 默认显示我的项目
      _this.q.range = _this.q.range || 'my';
      // 默认过滤为全部
      _this.q.status = _this.q.status || 'all';
      // 分页
      _this.tags['pagination-number'].on('change', function(n){
        _this.q.page = n;
        _this.app.query();
      });
      // 项目类型需要先从接口获取，因此列表接口是回调载入
      _this.app.getProjectTypeList(function(){
        _this.fn.getProjectList();
      });
    }
  });

  </script>

</fp-admin-project>
