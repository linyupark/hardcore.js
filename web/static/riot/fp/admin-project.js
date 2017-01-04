riot.tag2("project-history",'<section><h2> 管理后台 &gt; {app.lang.admin.project.title} &gt; 项目执行历史 </h2><table class="base"><thead><tr><th width="10%">序号</th><th width="10%">项目编号</th><th width="50%">名称</th><th width="20%">项目起止日期</th><th width="10%">{app.lang.admin.handle}</th></tr></thead><tbody><tr each="{tableList}"><td>{id}</td><td>{project_number}</td><td>{project_name}</td><td>{app.utils.time2str(created_at)} ~ {finished_at?app.utils.time2str(finished_at):\'未结束\'}</td><td><a href="#!admin-project/view/{parent.pid}?id={id}" class="under-line">查看详情</a></td></tr><tr if="{!tableList}"><td colspan="5"><spinner-dot></spinner-dot></td></tr></tbody><tfoot if="{tableList}"><tr><td class="left" colspan="5"> {app.lang.admin.counts.items} <b>{items}</b> {app.lang.admin.counts.unit} </td></tr></tfoot></table><pagination-number page="{page}" pages="{pages}" select="y"></pagination-number></section>',"","",function(e){var t=this;t.q=t.app.route.query,t.pid=t.app.route.params[2],t.fn={getHistory:function(){t.app.api("GET","project/default/history",{data:{page:t.q.page||1,id:t.pid}}).on("done",function(e){t.update({tableList:e.items,page:e.counts.page,pages:e.counts.total_page,items:e.counts.total_items}),t.tags["pagination-number"].emit("render")})}},t.on("mount",function(){t.fn.getHistory(),t.tags["pagination-number"].on("change",function(e){t.q.page=e,t.app.query()})})}),riot.tag2("project-view",'<section><h2> 管理后台 &gt; {app.lang.admin.project.title} &gt; 项目详细 </h2><div class="project-view"><span class="header-mark"> 项目起止日期: {project.perform.created_at?app.utils.time2str(project.perform.created_at):\'未开始\'} ~ {project.perform.finished_at?app.utils.time2str(project.perform.finished_at):\'未结束\'} </span><h4>基本信息</h4><div class="c2"><div class="row"><p><label>项目名称:</label> {project[\'base-info\'].name} </p><p><label>项目编号:</label> {project[\'base-info\'].number} </p></div><div class="row"><p><label>项目类型:</label> {project[\'base-info\'].project_types_name} </p><p><label>项目状态:</label><span class="txt-success"> {[\'已结束\',\'执行中\'][project[\'base-info\'].status]}</span></p></div><div class="row"><p><label>项目总金额:</label> {project[\'base-info\'].amount} </p><p><label>公开项目:</label> {project[\'base-info\'].is_public==1?\'是\':\'否\'} </p></div></div><div class="c1"><label>项目简介:</label><p> {project[\'base-info\'].description} </p></div><br><hr><h4>执行信息</h4><div class="c1"><label>执行单位:</label><p> {project.performer.organization_name} </p></div><div class="c2"><div class="row"><p><label>单位负责人:</label> {project.performer.head_name} </p><p><label>联系电话:</label> {project.performer.head_tel} </p></div><div class="row"><p><label>项目联络人:</label> {project.performer.contact_name} </p><p><label>联系电话:</label> {project.performer.contact_tel} </p></div></div><br><hr><div each="{ag, i in project.agreement}"><h4>项目关联协议({i+1})</h4><div class="c2"><div class="row"><p><label>协议名称:</label> {ag.agreement_name} </p><p><label>协议编号:</label> {ag.agreement_number} </p></div><div class="row"><p><label>关联时间:</label> {app.utils.time2str(ag.create_date)} </p></div></div><br><hr></div><h4>到款状态</h4><div class="c1"><label>是否已到款:</label><p> {project.payment_status?\'是\':\'否\'} </p></div><br><hr><h4>项目执行</h4><div class="row-step"><div class="step-box"><div class="step-num {active:project.perform.create_status==1}">1</div><div class="step-line"></div><div class="step-num {active:project.perform.payment_status==1}">2</div><div class="step-line"></div><div class="step-num {active:project.perform.review_status==1}">3</div><div class="step-line"></div><div class="step-num {active:project.perform.verify_status==1}">4</div><div class="step-line"></div><div class="step-num {active:project.perform.confirm_status==1}">5</div><div class="step-line"></div><div class="step-num {active:project.perform.issue_status==1}">6</div></div><div class="text-box"><p>立项</p><p>确认到款</p><p>录入评审结果</p><p>项目部审核</p><p>捐赠方确认</p><p>发放完成</p></div></div><br><hr><div class="c1 btn-line" style="text-indent: 0; text-align: center"><button type="button" onclick="{fn.back}" class="btn-gray">{app.lang.admin.btn.back}</button></div></div></section>',"","",function(e){var t=this;t.pid=t.app.route.params[2],t.pk_id=t.app.route.query.id,t.project={"base-info":{},perform:{},performer:{},agreement:[]},t.fn={back:function(){history.back()},getDetail:function(){t.app.api("GET","project/default/view",{data:{id:t.pid,pk_id:t.pk_id}}).on("done",function(e){t.update({project:e})})}},t.on("mount",function(){t.fn.getDetail()})}),riot.tag2("project-perform",'<div class="project-perform" if="{opts.pid>0}"><h2 class="title">{perform.project_name}项目执行</h2><div style="overflow: hidden"><div class="step-box"><div each="{p, i in perform.process}"><div class="step-num {active: p.status==1}">{i+1}</div><div if="{i!=5}" class="step-line"></div></div></div><div class="process-list"><div class="line {odd:i%2==0}" each="{p, i in perform.process}"><h4>{p.title}</h4><p if="{i==0}"> 创建即立项 <span if="{p.status==1 && !p.active}">执行中</span><button type="button" if="{p.active}" onclick="{fn.create}" class="btn-main">开始执行</button></p><p if="{i==1}"> 本项目已经到款金额{p.payment_sum}元 <a if="{p.status==1}" href="javascript:;" onclick="{fn.checkPayment}" class="under-line">查看到款信息</a><span if="{p.status==1 && !p.active}">已确认</span><button type="button" onclick="{fn.CFPayment}" if="{p.status!=1||p.active}" class="{\'btn-gray\':!p.active, \'btn-main\':p.active}" disabled="{!p.active}">确认</button></p><p if="{i==2}"> 由各执行单位（院系／机构／部门）录入评比结果 <a if="{p.status==1&&p.review_file.length>0}" href="javascript:;" onclick="{fn.download}" class="under-line">下载评审结果</a><span if="{p.status==1&&!p.active&&p.review_file.length>0}">已上传</span><upload-formdata changeupload="true" ref="upload" name="file[]" if="{p.status!=1||p.active}" btn="{p.review_file.length>0?\'重新上传\':\'上传\'}" disable="{!p.active}"></upload-formdata></p><p if="{i==3}"> 由项目部对评审结果进行审批核实 <span if="{p.status==1 && !p.active}">已确认</span><button type="button" if="{p.status!=1||p.active}" onclick="{fn.CFVerify}" class="{\'btn-gray\':!p.active, \'btn-main\':p.active}" disabled="{!p.active}">确认</button></p><p if="{i==4}"> 请导出评选结果，并发邮件给捐赠方确认 <span if="{p.status==1 && !p.active}">已确认</span><button type="button" if="{p.status!=1||p.active}" onclick="{fn.CFDonor}" class="{\'btn-gray\':!p.active, \'btn-main\':p.active}" disabled="{!p.active}">确认</button></p><p if="{i==5}"><a href="javascript:;" class="under-line" onclick="{fn.history}">查看历史执行</a><span if="{p.status==1 && !p.active}">已确认</span><button type="button" if="{p.status!=1||p.active}" onclick="{fn.CFIssue}" class="{\'btn-gray\':!p.active, \'btn-main\':p.active}" disabled="{!p.active}">确认</button></p></div></div></div><br><br></div><div class="warning-box" if="{opts.pid==0}"> 需要先创建项目后才能编辑此页 <a href="#!{app.route.path}?tab=baseinfo">返回创建</a></div><modal-confirm ref="cf_payment" type="payment"></modal-confirm>',"","",function(e){var t=this;t.perform={},t.fn={download:function(e){e.item.p.review_file.forEach(function(e){window.open(e.file_path)})},history:function(e){t.app.route(t.app.route.params[0]+"/history/"+t.app.route.params[2])},CFIssue:function(n){t.app.api("POST","project/perform/issue?id="+e.pid,{trigger:n.target}).on("done",function(e){t.fn.getPerform(function(){t.app.alert("发放确认成功","success")})})},CFDonor:function(n){t.app.api("POST","project/perform/confirm?id="+e.pid,{trigger:n.target}).on("done",function(e){t.fn.getPerform(function(){t.app.alert("捐赠方确认成功","success")})})},CFVerify:function(n){t.app.api("POST","project/perform/verify?id="+e.pid,{trigger:n.target}).on("done",function(e){t.fn.getPerform(function(){t.app.alert("确认审核成功","success")})})},CFPayment:function(n){t.refs.cf_payment.emit("open").once("ok",function(){t.app.api("POST","project/perform/payment?id="+e.pid,{trigger:n.target}).on("done",function(e){t.fn.getPerform(function(){t.app.alert("确认到账成功","success")})})})},create:function(n){t.app.api("POST","project/perform/create?id="+e.pid,{trigger:n.target}).on("done",function(e){t.fn.getPerform(function(){t.app.alert("创建立项成功","success")})})},checkPayment:function(){t.app.route(t.app.route.path+"?tab=payment")},getPerform:function(n){t.app.api("GET","project/perform/index",{data:{id:e.pid}}).on("done",function(a){t.perform=a,t.update(),n&&n(),t.refs.upload&&t.refs.upload.once("post",function(n){t.app.api("POST","project/perform/review?id="+e.pid,{payload:!0,showProgress:!0,formdata:!0,data:n}).on("done",function(e){t.fn.getPerform(function(){t.app.alert("上传成功","success"),t.refs.upload.emit("disable",!1)})}).on("progress",function(e){t.refs.upload.emit("disable",!0),t.refs.upload.emit("setBtnText",100==e?"上传完毕":e+"%")})})})}},t.on("mount",function(){0!==e.pid&&t.fn.getPerform()})}),riot.tag2("project-payment",'<div class="project-payment" if="{opts.pid>0}"><div class="filter"><button type="button" class="btn-main" onclick="{fn.addPayment}"><i class="icon-plus"></i> 添加记录 </button></div><form if="{addMode}" class="payment {animation: addMode}"><h4>添加到款记录</h4><div class="c2"><div class="row"><p><label>到款金额(元):</label><input ref="amount_0" type="text"><input-valid ref="validOnSave_0" rule="required" for="amount_0" msg="请填写到款金额"></p></div><div class="row"><p><label>所属协议:</label><agreement-select ref="agreement_name_0"></agreement-select></p><p><label>到款日期:</label><input type="text" onclick="WdatePicker()" ref="pay_date_0" value=""><i class="icon-calendar"></i></p></div><div class="row"><p><label>记录人:</label><input type="text" riot-value="{app.data.user_name}" disabled></p></div></div><div class="c1 btn-line"><button type="button" onclick="{fn.save}" class="btn-yellow">{app.lang.admin.btn.save}</button><button type="button" onclick="{fn.cancel}" class="btn-gray">{app.lang.admin.btn.cancel}</button></div></form><form each="{payment, i in paymentList}" class="payment"><h4>到款记录 {i+1<10?\'0\'+(i+1):i+1}</h4><p class="btn-line-top"><a href="javascript:;" aria-label="{app.lang.admin.handles.edit}" class="c-tooltip--top"><i onclick="{fn.edit}" class="btn-icon icon-pencil"></i></a><a href="javascript:;" aria-label="{app.lang.admin.handles.remove}" class="c-tooltip--top"><i onclick="{fn.remove}" class="btn-icon icon-trash"></i></a></p><div class="c2"><div class="row"><p><label>到款金额(元):</label><span if="{!payment.editMode}">{payment.amount}</span><input if="{payment.editMode}" ref="amount_{i+1}" type="text" riot-value="{payment.amount}"><input-valid if="{payment.editMode}" ref="validOnSave_{i+1}" rule="required" for="amount_{i+1}" msg="请填写到款金额"></p></div><div class="row"><p><label>所属协议:</label><span if="{!payment.editMode}">{payment.agreement_name}</span><agreement-select if="{payment.editMode}" ref="agreement_name_{i+1}"></agreement-select></p><p><label>到款日期:</label><span if="{!payment.editMode}">{app.utils.time2str(payment.pay_date)}</span><input if="{payment.editMode}" type="text" onclick="WdatePicker()" ref="pay_date_{i+1}" riot-value="{payment.pay_date && app.utils.time2str(payment.pay_date, {sp:\'-\'})}"><i if="{payment.editMode}" class="icon-calendar"></i></p></div><div class="row"><p><label>记录人:</label><span if="{!payment.editMode}">{payment.operator_name}</span><input if="{payment.editMode}" type="text" riot-value="{payment.operator_name}" disabled></p></div></div><div class="c1 btn-line" if="{payment.editMode}"><button type="button" onclick="{fn.save}" class="btn-yellow">{app.lang.admin.btn.save}</button><button type="button" onclick="{fn.cancel}" class="btn-gray">{app.lang.admin.btn.cancel}</button></div></form><pagination-number page="{page}" pages="{pages}" select="y"></pagination-number><br><br><br><br></div><div class="warning-box" if="{opts.pid==0}"> 需要先创建项目后才能编辑此页 <a href="#!{app.route.path}?tab=baseinfo">返回创建</a></div><div class="warning-box" if="{!addMode && paymentList&&paymentList.length==0}"> 该项目还没有到款记录，可点击右上方添加。 </div><modal-confirm type="delete" ref="rmmodal"></modal-confirm>','project-payment .filter,[data-is="project-payment"] .filter{ text-align: right; border-bottom: 2px dotted #ebebeb; padding-bottom: 10px; } project-payment .filter button,[data-is="project-payment"] .filter button{ padding-right: 15px;} project-payment .payment-list,[data-is="project-payment"] .payment-list{position: relative; } project-payment .animation,[data-is="project-payment"] .animation{ animation: fadeInDown .2s; }',"",function(e){var t=this;t.fn={remove:function(n){t.refs.rmmodal.emit("open").once("ok",function(){t.app.api("GET","project/payment/delete",{data:{id:e.pid,pk_id:n.item.payment.id}}).on("done",function(){t.app.alert("删除成功","success"),t.fn.getPaymentList()})})},addPayment:function(){t.addMode=!0},save:function(n){var a,i=0;n.item&&n.item.payment?(i=n.item.i+1,a="project/payment/update?id="+e.pid+"&pk_id="+n.item.payment.id):(i=0,a="project/payment/create?id="+e.pid),t.app.validAll([t.refs["validOnSave_"+i],t.refs["agreement_name_"+i]]).then(function(){return t.app.api("POST",a,{trigger:n.target,data:{data:JSON.stringify({amount:t.refs["amount_"+i].value,agreement_id:t.refs["agreement_name_"+i].getId(),pay_date:t.app.utils.str2time(t.refs["pay_date_"+i].value)})}}).on("done",function(){t.fn.getPaymentList(),n.item&&delete n.item.payment.editMode,t.addMode=!1,t.app.alert("保存成功","success")})}).catch(function(){t.app.alert("表单有错误请检查","warning")})},cancel:function(e){e.item&&e.item.payment?delete e.item.payment.editMode:t.addMode=!1},edit:function(e){e.item.payment.editMode=!0,t.update(),t.refs["agreement_name_"+(e.item.i+1)].emit("set",{id:e.item.payment.agreement_id,name:e.item.payment.agreement_name})},getPaymentList:function(){t.app.api("GET","project/payment/index",{data:{id:e.pid}}).on("done",function(e){t.update({paymentList:e.items,page:e.counts.page,pages:e.counts.total_page,items:e.counts.total_items}),t.tags["pagination-number"].emit("render")})}},t.on("mount",function(){0!==e.pid&&(t.app.addResource("my97"),t.tags["pagination-number"].on("change",function(e){t.q.page=e,t.app.query()}),t.fn.getPaymentList())})}),riot.tag2("project-agreement",'<div class="project-agreement" if="{opts.pid>0}"><table-filter for="project-agreement"><yield to="addon"><button type="button" class="main" onclick="{parent.fn.modalAddAgreement}"><i class="icon-plus"></i> 添加关联协议 </button></yield></table-filter><br><table class="base"><thead><tr><th width="10%">{app.lang.admin.agreement.id}</th><th width="15%">{app.lang.admin.agreement.number}</th><th width="50%">{app.lang.admin.agreement.name}</th><th width="15%">关联日期</th><th width="10%">{app.lang.admin.handle}</th></tr></thead><tbody><tr each="{tableList}"><td>{id}</td><td>{agreement_number}</td><td class="left">{agreement_name}</td><td>{app.utils.time2str(create_date)}</td><td><a href="javascript:;" aria-label="取消关联" class="c-tooltip--top"><i onclick="{fn.remove}" class="btn-icon icon-trash"></i></a></td></tr><tr if="{!tableList}"><td colspan="5"><spinner-dot></spinner-dot></td></tr></tbody><tfoot if="{tableList}"><tr><td class="left" colspan="5"> {app.lang.admin.counts.items} <b>{items}</b> {app.lang.admin.counts.unit} </td></tr></tfoot></table><pagination-number page="{page}" pages="{pages}" select="y"></pagination-number><br><br><br></div><div class="warning-box" if="{opts.pid==0}"> 需要先创建项目后才能编辑此页 <a href="#!{app.route.path}?tab=baseinfo">返回创建</a></div><modal-agreement pid="{opts.pid}" ref="agmodal"></modal-agreement><modal-confirm type="delete" ref="rmmodal"></modal-confirm>','project-agreement .project-agreement table-filter div,[data-is="project-agreement"] .project-agreement table-filter div{ margin: 0 }',"",function(e){var t=this;t.fn={remove:function(n){t.refs.rmmodal.emit("open").on("ok",function(){t.app.api("GET","project/agreement/delete",{data:{pk_id:n.item.id,id:e.pid}}).on("done",function(){t.app.alert("取消关联成功","success"),t.fn.getAgreementList()})})},modalAddAgreement:function(){t.refs.agmodal.emit("open")},getAgreementList:function(){t.app.api("GET","project/agreement/index",{data:{id:e.pid}}).on("done",function(e){t.update({tableList:e.items,page:e.counts.page,pages:e.counts.total_page,items:e.counts.total_items}),t.tags["pagination-number"].emit("render")})}},t.on("mount",function(){e.pid>0&&t.fn.getAgreementList(),t.refs.agmodal.on("added",function(){t.fn.getAgreementList()})})}),riot.tag2("project-form",'<section><h2> 管理后台 &gt; {app.lang.admin.project.title} &gt; {project.id?\'修改\':\'添加\'}<span if="{key==parent.formTab}" each="{formTabList}">{name}</span></h2><form class="project"><div class="top-tab-line" if="{project.id}"><a href="javascript:;" onclick="{fn.tabChange}" class="c4 {active: key==parent.formTab}" each="{formTabList}">{name}</a></div><project-agreement if="{formTab==\'agreements\'}" pid="{project.id}"></project-agreement><project-payment if="{formTab==\'payment\'}" pid="{project.id}"></project-payment><project-perform if="{formTab==\'perform\'}" pid="{project.id}"></project-perform><div if="{formTab==\'baseinfo\'}"><h4>基本信息</h4><div class="c2"><div class="row"><p><label>{app.lang.admin.project.name}</label><input type="text" ref="name" riot-value="{project.baseinfo.name}" placeholder="{app.lang.admin.form.req}"><input-valid ref="validOnSave" for="name" rule="required" msg="{app.lang.admin.project.name}{app.lang.admin.form.req}"></input-valid></p><p><label>{app.lang.admin.project.number}</label><input type="text" ref="number" riot-value="{project.baseinfo.number}" placeholder="{app.lang.admin.form.req}"><input-valid ref="validOnSave" for="number" rule="required" msg="{app.lang.admin.project.number}{app.lang.admin.form.req}"></input-valid></p></div><div class="row"><p><label>{app.lang.admin.project.type}</label><project-type-select disable="{project.id>0?1:0}" ref="project_type"></project-type-select></p><p><label>{app.lang.admin.project.status}</label><select ref="status"><option each="{statusList}" selected="{project.baseinfo.status==key}" riot-value="{key}">{name}</option></select></p></div><div class="row"><p><label>{app.lang.admin.project.amount}</label><input type="text" ref="amount" riot-value="{project.baseinfo.amount}" placeholder="{app.lang.admin.form.req}"><input-valid ref="validOnSave" for="amount" rule="number" msg="{app.lang.admin.project.amount}{app.lang.admin.form.req}"></input-valid></p><p><label>{app.lang.admin.project.isPublic}</label><label class="radio"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="radio" name="is_public" ref="is_public" checked="{project.baseinfo.is_public==1}"> {app.lang.yes} </label><label class="radio"><input type="radio" name="is_public" ref="is_public" checked="{project.baseinfo.is_public==0}"> {app.lang.no} <label></p></div></div><div class="c1"><label class="top">项目简介</label><p><textarea ref="description">{project.baseinfo.description}</textarea></p></div><hr><br><h4>执行信息</h4><div class="row c4"><p><label>部门单位</label><org-select ref="organization"></org-select></p></div><div class="row c4"><p><label>负责人</label><user-select ref="head_name" for="admin"></user-select> &nbsp; <input type="text" ref="head_tel" placeholder="电话" riot-value="{project.baseinfo.head_tel}"> &nbsp; <input type="text" ref="head_email" placeholder="邮箱" riot-value="{project.baseinfo.head_email}"><input-valid style="left: 245px" ref="validOnSave" for="head_tel,head_email" rule="required" msg="请填写负责人的电话、邮箱"></input-valid><input-valid style="left: 445px" ref="validOnSave" for="head_email" rule="email" msg="邮箱格式不正确"></input-valid></p></div><div class="row c4"><p><label>联络人</label><input type="text" ref="contact_name" placeholder="姓名" riot-value="{project.baseinfo.contact_name}"> &nbsp; <input type="text" ref="contact_tel" placeholder="电话" riot-value="{project.baseinfo.contact_tel}"> &nbsp; <input type="text" ref="contact_email" placeholder="邮箱" riot-value="{project.baseinfo.contact_email}"><input-valid ref="validOnSave" for="contact_name,contact_tel,contact_email" rule="required" msg="请填写联络人的姓名、电话、邮箱"></input-valid><input-valid style="left: 445px" ref="validOnSave" for="contact_email" rule="email" msg="邮箱格式不正确"></input-valid></p></div><hr><br><div class="c1 btn-line"><button type="button" onclick="{fn.save}" class="btn-yellow">{app.lang.admin.btn.save}</button><button type="button" onclick="{fn.cancel}" class="btn-gray">{app.lang.admin.btn.back}</button></div></div></form></section>',"","",function(e){var t=this;t.q=t.app.route.query,t.formTabList=t.app.lang.admin.project.formTab,t.formTab=t.q.tab||t.formTabList[0].key,t.project={id:t.app.route.params[2]||0,baseinfo:{is_public:1}},t.statusList=[{name:"开始",key:1},{name:"完成",key:0}],t.fn={save:function(e){"baseinfo"===t.formTab&&t.app.validAll(t.refs.validOnSave.concat(t.refs.project_type,t.refs.organization,t.refs.head_name)).then(function(){t.project.id>0?api="project/default/base-info-update?id="+t.project.id:api="project/default/base-info-create",t.app.api("POST",api,{trigger:e.target,data:{data:JSON.stringify({name:t.refs.name.value,number:t.refs.number.value,project_types_id:t.refs.project_type.getId(),status:t.refs.status.value,amount:t.refs.amount.value,is_public:t.refs.is_public[0].checked?1:0,description:t.refs.description.value,organization_id:t.refs.organization.getId(),contact_name:t.refs.contact_name.value,contact_tel:t.refs.contact_tel.value,contact_email:t.refs.contact_email.value,head_name:t.refs.head_name.getName(),head_uid:t.refs.head_name.getId(),head_tel:t.refs.head_tel.value,head_email:t.refs.head_email.value})}}).on("done",function(e){t.app.alert("项目资料保存成功","success"),!t.project.id&&t.app.route("admin-project")})}).catch(function(e){t.app.alert("请检查表单","warning")})},cancel:function(){t.app.route(t.app.route.params[0])},tabChange:function(e){t.q.tab=e.item.key,t.app.query()}},t.on("mount",function(){"baseinfo"===t.formTab&&t.project.id>0&&t.app.api("GET","project/default/base-info",{data:{id:t.project.id}}).on("done",function(e){t.project.baseinfo=e,t.update(),setTimeout(function(){t.refs.project_type.emit("set",{id:e.project_types_id}),t.refs.head_name.emit("set",{id:e.head_uid,name:e.head_name}),t.refs.organization.emit("set",e.organization_id),t.update()},100)})})}),riot.tag2("fp-admin-project",'<header for="admin"></header><main class="admin"><div class="container"><admin-sidenav></admin-sidenav><project-view if="{section==\'view\'}"></project-view><project-history if="{section==\'history\'}"></project-history><project-form if="{section==\'add\'}"></project-form><project-form if="{section==\'edit\'}"></project-form><section if="{section==\'index\'}"><h2> 管理后台 &gt; {app.lang.admin.project.title} </h2><div class="table-tab"><a href="javascript:;" onclick="{fn.filterRange}" each="{filterRange}" class="{active:q.range==key}">{name}</a></div><table-filter for="project"><yield to="addon"><button class="main" onclick="{parent.fn.add}"><i class="icon-plus"></i> {app.lang.admin.project.add} </button></yield></table-filter><table class="base"><thead><tr><th width="10%">{app.lang.admin.project.id}</th><th width="10%">{app.lang.admin.project.number}</th><th width="30%">{app.lang.admin.project.name}</th><th width="10%">{app.lang.admin.project.type}</th><th width="10%">{app.lang.admin.project.amount}</th><th width="10%">{app.lang.admin.project.status}</th><th width="10%">{app.lang.admin.project.createAt}</th><th width="10%">{app.lang.admin.handle}</th></tr></thead><tbody><tr each="{tableList}"><td>{id}</td><td>{number}</td><td class="left">{name}</td><td>{app.getProjectType(project_types_id)}</td><td>{amount}</td><td>{[\'完成\',\'开始\'][status]}</td><td>{created_at&&app.utils.time2str(created_at)||\'-\'}</td><td><a href="javascript:;" aria-label="{app.lang.admin.handles.edit}" class="c-tooltip--top"><i onclick="{fn.edit}" class="btn-icon icon-pencil"></i></a><a href="javascript:;" aria-label="{app.lang.admin.handles.remove}" class="c-tooltip--top"><i onclick="{fn.remove}" class="btn-icon icon-trash"></i></a></td></tr><tr if="{!tableList}"><td colspan="8"><spinner-dot></spinner-dot></td></tr></tbody><tfoot if="{tableList}"><tr><td class="left" colspan="8"> {app.lang.admin.counts.items} <b>{items}</b> {app.lang.admin.counts.unit} </td></tr></tfoot></table><pagination-number page="{page}" pages="{pages}" select="y"></pagination-number></section></div></main><footer class="admin"></footer><modal-confirm type="delete"></modal-confirm>',"","",function(e){var t=this;t.q=t.app.route.query,t.section=t.app.route.params[1]||"index",t.filterRange=t.app.lang.admin.project["filter:range"],t.fn={remove:function(e){t.tags["modal-confirm"].emit("open").once("ok",function(){t.app.api("GET","project/default/delete",{data:{id:e.item.id}}).on("done",function(){t.app.alert("项目删除成功","success"),t.fn.getProjectList()})})},add:function(){t.app.route(t.app.route.path+"/add")},edit:function(e){t.app.route(t.app.route.path+"/edit/"+e.item.id)},filterRange:function(e){t.q.range=e.item.key,t.app.query()},getProjectList:function(){t.app.api("GET","project/default/"+t.q.range,{data:{page:t.q.page||1,condition:"all"==t.q.status?"":t.q.status}}).on("done",function(e){t.update({tableList:e.items,page:e.counts.page,pages:e.counts.total_page,items:e.counts.total_items}),t.tags["pagination-number"].emit("render")})}},this.on("mount",function(){"index"===t.section&&(t.q.range=t.q.range||"my",t.q.status=t.q.status||"all",t.tags["pagination-number"].on("change",function(e){t.q.page=e,t.app.query()}),t.app.getProjectTypeList(function(){t.fn.getProjectList()}))})});