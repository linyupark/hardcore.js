riot.tag2("donor-form",'<section><h2> 管理后台 &gt; {app.lang.admin.donor.title} &gt; {app.lang.admin.donor[app.route.params[1]]} </h2><form class="donor"><h4>{app.lang.admin.donor.baseinfo}</h4><div class="c2"><div class="row"><p><label>{app.lang.admin.donor.name}*</label><input type="text" ref="donor_name" riot-value="{form.donor_name}" placeholder="{app.lang.admin.form.req}"><input-valid ref="validOnSave" for="donor_name" rule="required" msg="{app.lang.admin.donor.name}{app.lang.admin.form.req}"></input-valid></p><p><label>{app.lang.admin.donor.type}</label><select ref="donor_type"><option each="{donorNature}" riot-value="{key}" selected="{form.type==key}">{name}</option></select></p></div><div class="row"><p><label>{app.lang.admin.donor.company}</label><input type="text" ref="company" riot-value="{form.company}" placeholder=""></p><p><label>{app.lang.admin.donor.address}</label><input type="text" ref="address" riot-value="{form.address}" placeholder=""></p></div><div class="row"><p><label>{app.lang.admin.donor.tel}</label><input type="text" ref="tel" riot-value="{form.tel}" placeholder=""></p><p><label>{app.lang.admin.donor.email}</label><input type="text" ref="email" riot-value="{form.email}" placeholder=""><input-valid ref="validOnSave" for="email" rule="email" msg="检查{app.lang.admin.donor.email}格式"></input-valid></p></div><div class="row"><p><label>{app.lang.admin.donor.website}</label><input type="text" ref="website" riot-value="{form.website}" placeholder=""></p><p><label>{app.lang.admin.donor.weibo}</label><input type="text" ref="weibo" riot-value="{form.weibo}" placeholder=""></p></div></div><div class="row"><p><label>{app.lang.admin.donor.head}</label><input type="text" ref="head" riot-value="{form.head}" placeholder="{app.lang.admin.donor[\'head:name\']}"> &nbsp; <input type="text" ref="head_tel" riot-value="{form.head_tel}" placeholder="{app.lang.admin.donor.tel}"><input-valid ref="validOnSave" for="head,head_tel" rule="required" msg="请填写负责人姓名跟联络电话"></input-valid></p></div><div class="row"><p><label>{app.lang.admin.donor.contact}</label><input type="text" ref="contact" riot-value="{form.contact}" placeholder="{app.lang.admin.donor[\'operator:name\']}"> &nbsp; <input type="text" ref="contact_tel" riot-value="{form.contact_tel}" placeholder="{app.lang.admin.donor.tel}"><input-valid ref="validOnSave" for="contact,contact_tel" rule="required" msg="请填写联络人姓名跟联络电话"></input-valid></p></div><hr><br><h4>{app.lang.admin.donor.members}</h4><br><div class="row c4" each="{m, i in form.donor_member}"><p><label>成员{i+1}</label><input type="text" riot-value="{m.username}" disabled> &nbsp; <input type="text" riot-value="{m.place_name}" disabled> &nbsp; <input type="text" riot-value="{m.tel}" disabled> &nbsp; <input type="text" riot-value="{m.email}" disabled><a href="javascript:;" onclick="{fn.removeMember}" class="c-tooltips--top" aria-label="移除"><i class="icon-trash"></i></a></p></div><div class="row c4"><p><label>成员{form.donor_member.length+1}</label><input type="text" ref="member_username" placeholder="姓名"> &nbsp; <place-select ref="member_place" left="255"></place-select> &nbsp; <input type="text" ref="member_tel" placeholder="电话"> &nbsp; <input type="text" ref="member_email" placeholder="邮箱"><a href="javascript:;" onclick="{fn.addMember}" class="c-tooltips--top" aria-label="添加"><i class="icon-plus"></i></a><input-valid ref="validOnAddMember" for="member_username,member_tel" rule="required" msg="请填写该成员的姓名、电话"></input-valid><input-valid style="left: 625px" ref="validOnAddMember" for="member_email" rule="email" msg="邮箱格式不正确"></input-valid></p></div><hr><br><div class="c1 btn-line"><button type="button" onclick="{fn.save}" class="btn-yellow">{app.lang.admin.btn.save}</button><button type="button" onclick="{fn.cancel}" class="btn-gray">{app.lang.admin.btn.back}</button></div><br><br><br><br></form></section>',"","",function(e){var t=this;t.q=t.app.route.query,t.form_id=t.app.route.params[2]||0,t.donorNature=t.app.lang.admin.agreement["donor:nature:list"],t.form={donor_member:[]},t.fn={save:function(e){t.app.validAll(t.refs.validOnSave).then(function(){var n;n=t.form_id>0?"donor/default/update?id="+t.form_id:"donor/default/create",t.app.api("POST",n,{trigger:e.target,data:{data:JSON.stringify({donor_name:t.refs.donor_name.value,type:t.refs.donor_type.value,company:t.refs.company.value,address:t.refs.address.value,tel:t.refs.tel.value,email:t.refs.email.value,website:t.refs.website.value,weibo:t.refs.weibo.value,head:t.refs.head.value,head_tel:t.refs.head_tel.value,contact:t.refs.contact.value,contact_tel:t.refs.contact_tel.value,donor_member:t.form.donor_member})}}).on("done",function(e){t.app.alert("捐赠方信息保存成功","success"),!t.form_id&&t.app.route("admin-donor")})}).catch(function(){t.app.alert("请检查提交表单的信息","warning")})},cancel:function(){history.back()},removeMember:function(e){t.form.donor_member.splice(t.form.donor_member.indexOf(e.item.m),1)},addMember:function(){t.app.validAll(t.refs.validOnAddMember.concat(t.refs.member_place)).then(function(){t.form.donor_member.push({username:t.refs.member_username.value,place_id:t.refs.member_place.getId(),place_name:t.refs.member_place.getName(),tel:t.refs.member_tel.value,email:t.refs.member_email.value}),t.refs.member_place.emit("set",{id:"",name:""}),t.refs.member_username.value=t.refs.member_tel.value=t.refs.member_email.value="",t.update()}).catch(function(){})},getDonor:function(e){t.app.api("GET","donor/default/update",{data:{id:e}}).on("done",function(e){t.form=e,t.update()})}},t.on("mount",function(){t.form_id&&t.fn.getDonor(t.form_id)})}),riot.tag2("fp-admin-donor",'<header for="admin"></header><main class="admin"><div class="container"><admin-sidenav></admin-sidenav><donor-form if="{section==\'add\'}"></donor-form><donor-form if="{section==\'edit\'}"></donor-form><section if="{section==\'index\'}"><h2> 管理后台 &gt; {app.lang.admin.donor.title}</h2><table-filter for="donor"><yield to="addon"><button class="main" onclick="{parent.fn.add}"><i class="icon-plus"></i> {app.lang.admin.donor.add} </button></yield></table-filter><table class="base"><thead><tr><th width="10%">{app.lang.admin.donor.id}</th><th width="40%">{app.lang.admin.donor.name}</th><th width="10%">{app.lang.admin.donor.type}</th><th width="10%">{app.lang.admin.donor.contact}</th><th width="20%">{app.lang.admin.donor.tel}</th><th width="10%">{app.lang.admin.handle}</th></tr></thead><tbody><tr each="{tableList}"><td>{id}</td><td class="left">{donor_name}</td><td>{app.getNatureName(type)}</td><td>{contact||\'-\'}</td><td>{contact_tel||\'-\'}</td><td><a href="javascript:;" aria-label="{app.lang.admin.handles.edit}" class="c-tooltip--top"><i onclick="{fn.edit}" class="btn-icon icon-pencil"></i></a><a href="javascript:;" aria-label="{app.lang.admin.handles.remove}" class="c-tooltip--top"><i onclick="{fn.remove}" class="btn-icon icon-trash"></i></a></td></tr><tr if="{!tableList}"><td colspan="6"><spinner-dot></spinner-dot></td></tr></tbody><tfoot if="{tableList}"><tr><td class="left" colspan="6"> {app.lang.admin.counts.items} <b>{items}</b> {app.lang.admin.counts.unit} </td></tr></tfoot></table><pagination-number page="{page}" pages="{pages}" select="y"></pagination-number></section></div></main><footer class="admin"></footer><modal-remove></modal-remove>',"","",function(e){var t=this;t.q=t.app.route.query,t.section=t.app.route.params[1]||"index",t.fn={remove:function(e){t.tags["modal-remove"].emit("open").once("ok",function(){t.app.api("GET","donor/default/delete",{data:{id:e.item.id}}).on("done",function(){t.app.alert("捐赠方删除成功","success"),t.fn.getList()})})},add:function(){t.app.route(t.app.route.path+"/add")},edit:function(e){t.app.route(t.app.route.path+"/edit/"+e.item.id)},getList:function(){t.app.api("GET","donor/default/index",{data:{page:t.q.page||1}}).on("done",function(e){t.update({tableList:e.items,page:e.counts.page,pages:e.counts.total_page,items:e.counts.total_items}),t.tags["pagination-number"].emit("render")})}},this.on("mount",function(){"index"===t.section&&(t.fn.getList(),t.tags["pagination-number"].on("change",function(e){t.q.page=e,t.app.query()}))})});