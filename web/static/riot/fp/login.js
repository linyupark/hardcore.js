riot.tag2("fp-login",'<header for="login"></header><main class="login"><div class="container"><form class="login-from" onsubmit="return false"><p class="tab-line"><a href="javascript:;" class="{active: role==\'admin\'}" onclick="{fn.loginAdmin}">{app.lang.login.admin}</a><a href="javascript:;" class="{active: role==\'user\'}" onclick="{fn.loginUser}">{app.lang.login.user}</a></p><p><input type="text" ref="username" onclick="this.select()" placeholder="{app.lang.login.placehoder.username}"></p><p style="position: relative"><input type="password" ref="password" onclick="this.select()" placeholder="{app.lang.login.placehoder.password}"><a href="javascript:;" onclick="{fn.pwdToggle}" class="pwd-{pwd}"></a></p><div class="msg-space"><input-valid for="username,password" rule="required" msg="{app.lang.login.invalid}"></input-valid></div><p class="btn-line"><button ref="login" onclick="{fn.login}">{app.lang.login.btn}</button><br><a aria-label="请拨打联系电话找回密码" class="c-tooltip--top" href="javascript:;">{app.lang.login.findpass}</a></p></form></div></main><footer class="login"></footer>',"","",function(e){var t=this;t.role="admin",t.pwd="hide",t.ref=t.app.route.query.ref,t.api="backend/default/login",t.fn={login:function(e){t.tags["input-valid"].emit("check")},loginAdmin:function(){t.role="admin",t.api="backend/default/login"},loginUser:function(){t.role="user",t.api="frontend/default/login"},pwdToggle:function(){t.pwd="hide"===t.pwd?"show":"hide","hide"===t.pwd?t.refs.password.type="password":t.refs.password.type="text"}},t.on("mount",function(){t.ref&&t.refs.username.focus(),t.tags["input-valid"].on("valid",function(e){t.app.api("POST",t.api,{withCredentials:!0,data:{data:JSON.stringify({username:e[0].value,password:e[1].value})},trigger:t.refs.login}).on("done",function(){t.refs.login.innerText=t.app.lang.login["btn:ok"],t.app.utils.cookie.set("role",t.role,{"max-age":604800}),t.app.alert("登录成功","success"),t.ref?location.href=t.ref:(t.app.route(t.role+"-"+t.app.config.indexPage),window.scrollTo(0,0))}).off("error").on("error",function(e){t.tags["input-valid"].emit("msg",t.app.lang.login.fail)})})})});