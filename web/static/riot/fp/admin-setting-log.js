riot.tag2("fp-admin-setting-log",'<header for="admin"></header><main class="admin"><div class="container"><admin-sidenav></admin-sidenav><section><h2>管理后台 &gt; 设置 &gt; 系统日志</h2><table class="base" style="min-height: 634px"><thead><tr><th width="20%">日期</th><th width="10%">用户名</th><th width="10%">身份</th><th width="40%">操作描述</th><th width="20%">IP</th></tr></thead><tbody><tr each="{tableList}"><td>{app.utils.time2str(created_at, {showtime:1})}</td><td>{user_name}</td><td>{user_role}</td><td class="left">{description}</td><td>{ip}</td></tr><tr if="{!tableList}"><td colspan="5"><spinner-dot></spinner-dot></td></tr></tbody><tfoot if="{tableList}"><tr><td class="left" colspan="5"> {app.lang.admin.counts.items} <b>{items}</b> {app.lang.admin.counts.unit} </td></tr></tfoot></table><pagination-number page="{page}" pages="{pages}" select="y"></pagination-number></section></div></main><footer></footer>',"","",function(e){var t=this;t.q=t.app.route.query,t.fn={getLogList:function(){t.app.api("GET","system-setting/logs/index",{data:{page:t.q.page||1}}).on("done",function(e){t.update({tableList:e.items,page:e.counts.page,pages:e.counts.total_page,items:e.counts.total_items}),t.tags["pagination-number"].emit("render")})}},this.on("mount",function(){t.fn.getLogList(),t.tags["pagination-number"].on("change",function(e){t.q.page=e,t.app.query()})})});