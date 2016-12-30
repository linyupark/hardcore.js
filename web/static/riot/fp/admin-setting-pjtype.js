riot.tag2("fp-admin-setting-pjtype",'<header for="admin"></header><main class="admin"><div class="container"><admin-sidenav></admin-sidenav><section><h2>管理后台 &gt; 设置 &gt; 项目类型管理</h2><table-filter for="pjtype"><yield to="addon"><button class="main" onclick="{parent.fn.add}"><i class="icon-plus"></i> 添加项目类型 </button></yield></table-filter><table class="base"><thead><tr><th width="20%">序号</th><th width="40%">项目类型</th><th width="20%">排序</th><th width="20%">{app.lang.admin.handle}</th></tr></thead><tbody><tr each="{tableList}"><td>{id}</td><td>{name}</td><td>{sort}</td><td><a href="javascript:;" aria-label="{app.lang.admin.handles.edit}" class="c-tooltip--top"><i onclick="{fn.edit}" class="btn-icon icon-pencil"></i></a><a href="javascript:;" aria-label="{app.lang.admin.handles.remove}" class="c-tooltip--top"><i onclick="{fn.remove}" class="btn-icon icon-trash"></i></a></td></tr><tr if="{!tableList}"><td colspan="4"><spinner-dot></spinner-dot></td></tr></tbody><tfoot if="{tableList}"><tr><td class="left" colspan="4"> {app.lang.admin.counts.items} <b>{items}</b> {app.lang.admin.counts.unit} </td></tr></tfoot></table><pagination-number page="{page}" pages="{pages}" select="y"></pagination-number></section></div></main><footer class="admin"></footer><modal-remove></modal-remove><modal ref="saveType" w="400" h="260"><yield to="title"> {parent.pjtype.id?\'修改\':\'添加\'}项目类型 </yield><yield to="content"><form class="modal"><div class="row"><p><label>项目类型</label><input ref="type_name" type="text" riot-value="{parent.pjtype.name}"></p><p><label>排序</label><input ref="type_sort" type="text" riot-value="{parent.pjtype.sort}"><input-valid style="left: 85px" ref="validType" for="type_name,type_sort" rule="required" msg="项目类型跟排序都为必填"></input-valid></p></div></form></yield><yield to="button"><button type="button" onclick="{parent.fn.ok}" class="btn-main">{app.lang.admin.btn.ok}</button></yield><yield to="close">{app.lang.admin.btn.cancel}</yield></modal>',"","",function(e){var t=this;t.q=t.app.route.query,t.pjtype={},t.fn={remove:function(e){t.tags["modal-remove"].once("ok",function(){t.app.api("GET","system-setting/project-type/delete",{data:{id:e.item.id}}).on("done",function(){t.app.alert("项目类型删除成功","success"),t.fn.getTypeList()})}).emit("open")},ok:function(e){var a=t.pjtype.id?"system-setting/project-type/update?id="+t.pjtype.id:"system-setting/project-type/create";t.refs.saveType.refs.validType.once("valid",function(){var n=t.refs.saveType.refs.type_sort.value;return!Number(n)||Number(n)<0?this.emit("msg","排序必须为正整数"):void t.app.api("POST",a,{trigger:e.target,data:{data:JSON.stringify({name:t.refs.saveType.refs.type_name.value,sort:Number(n)})}}).once("done",function(){t.app.alert("操作成功","success"),t.fn.getTypeList(),t.refs.saveType.emit("close")})}).emit("check")},edit:function(e){t.pjtype=e.item,t.refs.saveType.emit("open"),t.refs.saveType.refs.validType.emit("msg","")},add:function(){t.pjtype={},t.refs.saveType.emit("open"),t.refs.saveType.refs.validType.emit("msg","")},getTypeList:function(){t.app.api("GET","system-setting/project-type/index",{data:{page:t.q.page||1}}).on("done",function(e){t.update({tableList:e.items,page:e.counts.page,pages:e.counts.total_page,items:e.counts.total_items}),t.tags["pagination-number"].emit("render")})}},this.on("mount",function(){t.fn.getTypeList(),t.tags["pagination-number"].on("change",function(e){t.q.page=e,t.app.query()})})});