


<!-- 添加编辑日志 -->
<daily-form>
  <style scoped>
  .relList{width: 92%; float: right; margin-bottom: 25px; position: relative;}
  </style>
  <section>
    <h2>管理后台 &gt; 工作日志 &gt; {did?'修改':'新增'}日志</h2>
    <form class="user-daily" onsubmit="return false">
      <h4>{did?'修改':'新增'}日志</h4>
      <div class="row c4">
        <p>
          <label class="top">关联对象</label>
          <span class="relList" each={rels}>
            <a href="javascript:;" onclick="{fn.rmRel}">
              <i class="icon-cancel"></i>
            </a>
            &nbsp;
            <select onchange="{fn.changeRelType}">
              <option each={parent.relTypeList} value="{k}" selected="{k==type_id}">{name}</option>
            </select>
            &nbsp;
            <donor-select ref="relValue" if={type_id==1}/>
            <org-select ref="relValue" if={type_id==2}/>
            <agreement-select ref="relValue" if={type_id==3}/>
            <project-select ref="relValue" if={type_id==4}/>
          </span>
          <span class="relList" style="padding-top:20px">
            <a href="javascript:;" onclick="{fn.addRel}">
              <i class="icon-plus"></i>
              &nbsp;&nbsp;&nbsp;添加
            </a>
          </span>
        </p>
      </div>
      <div class="row" style="position: relative">
        <p>
          <label class="top">详细内容</label>
          <tinymce-editor if="{editInited}" ref="edit" style="float: left" w="700px" h="300px" />
        </p>
        <user-select if={pos.x} for="admin" style="position: absolute; left: {pos.x+70||0}px; top: {pos.y+43||0}px;" ref="user"/>
      </div>
      <br><br>
      <div class="c1 btn-line">
        <button type="button" onclick={fn.save} class="btn-yellow">{app.lang.admin.btn.save}</button>
        <button type="button" onclick={fn.cancel} class="btn-gray">{app.lang.admin.btn.back}</button>
      </div>
      <br><br><br>
    </form>
  </section>

  <script>
  var _this = this;
  _this.did = _this.app.route.params[2];
  _this.daily = {};
  _this.pos = {};
  _this.rels = [];
  _this.relTypeList = [
    {k:1, name: '捐赠方'},{k:2, name: '机构'},
    {k:3, name: '协议'},{k:4, name: '项目'}
  ];
  _this.fn = {
    cancel: function(e){
      history.back();
    },
    save: function(e){
      var api = 'daily-manager/default/create', relData = [],
      saveHandle = function(){
        _this.app.api('POST', api, {
          trigger: e.target,
          data: {
            data: JSON.stringify({
              relation: relData,
              content: _this.refs.edit.getContent()
            })
          }
        }).on('done', function(){
          _this.app.alert('日志保存成功', 'success');
          // 跳转到列表
          !_this.did && _this.app.route('admin-daily');
        });
      };
      if(_this.did) api = 'daily-manager/default/update?id=' + _this.did;
      if(!_this.refs.relValue){
        return saveHandle();
      }
      // 检查数据
      _this.app.validAll([].concat(_this.refs.relValue)).then(function(){
        // 获取关联信息
        _this.rels.forEach(function(r, i){
          var v = _this.refs.relValue[i] || _this.refs.relValue;
          _this.rels[i].value_id = v.getId();
          relData.push(_this.rels[i]);
        });
        saveHandle();
      }).catch(function(){
        _this.app.alert('请检查表单数据', 'warning');
      });
    },
    changeRelType: function(e){
      e.item.type_id = e.target.value;
    },
    rmRel: function(e){
      _this.rels.splice(_this.rels.indexOf(e.item), 1);
    },
    addRel: function(e){
      _this.rels.push({
        type_id: 1, value_id: 0, value_name: ''
      });
    },
    getDaily: function(){
      _this.app.api('GET', 'daily-manager/default/update', {
        data: { id: _this.did }
      }).on('done', function(data){
        _this.update({
          daily: data,
          rels: data.relation
        });
        // 编辑器写入内容
        _this.refs.edit.once('inited', function(){
          this.emit('setContent', data.content);
        });
        // 关联对象
        data.relation && data.relation.forEach(function(r,i){
          var v = _this.refs.relValue[i] || _this.refs.relValue;
          // 机构
          if(r.type_id == 2){
            v.emit('set', r.value_id);
          }
          else{
            v.emit('set', {
              name: r.value_name, id: r.value_id
            });
          }
        });
      });
    }
  };
  _this.on('mount', function(){
    // 加载编辑器资源
    _this.app.addResource('tinymce')
    .then(function(){
      _this.editInited = true;
      _this.update();
      if(_this.did){
        _this.fn.getDaily();
      }
      _this.refs.edit.on('keyup', function(e, data){
        if(e.keyCode == 8){
          // 删除的时候
          if(data.edit.selection.getNode().getAttribute('class') === 'atuser'){
            data.edit.selection.select(data.edit.selection.getNode());
          }
        }
        if(e.shiftKey && e.keyCode == 50){
          var content = _this.refs.edit.getContent().slice(0, -1);
          // @弹出用户下拉
          _this.update({
            pos: data.pos
          });
          _this.refs.user
          .emit('focus')
          .once('select', function(user){
            _this.refs.edit.emit('setContent', content);
            _this.refs.edit.emit('insertContent', '<span class="atuser">@'+user.real_name+'</span>&nbsp;');
            _this.update({ pos: {} });
          });
        }
      });
    });
  });
  </script>
</daily-form>

<fp-admin-daily>

  <style scoped>
  .fadein{
    animation: fadeIn .5s;
  }
  .top-tab-line i{
    font-size: 12px;
    display: inline-block;
    height: 18px;
    width: 18px;
    border-radius: 18px;
    background: #E01B46;
    line-height: 18px;
    color: #fff;
    vertical-align: text-bottom;
    font-style: normal;
    text-align: center;
    margin-left: 6px;
  }
  </style>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <daily-form if={section=='add'}/>
      <daily-form if={section=='edit'}/>
      <section if={section=='index'}>
        <h2>管理后台 &gt; 工作日志</h2>
        <form class="user-daily" onsubmit="return false">
          <div class="top-tab-line">
            <a href="javascript:;" onclick={fn.rangeChange} class="c4 {active: k==parent.q.range}" each={rangeList}>{name}<i if="{k=='information'&&app.data.unread>0}">{app.data.unread}</i></a>
          </div>
          <table-filter for="daily">
            <yield to="addon">
              <button type="button" class="main" onclick={parent.fn.add}>
                <i class="icon-plus"></i> 添加新日志
              </button>
            </yield>
          </table-filter>

          <!-- 日志列表 -->
          <div if={!dailyList} class="daily-box">
            <br><br>
            <spinner-dot/>
          </div>
          <div if={dailyList&&dailyList.length==0} class="daily-box">
            <br><br>
            <p style="text-align: center">没有相关日志</p>
          </div>
          <div each={dailyList} class="daily-box">
            <p class="user-date">
              <strong>{user_name}</strong>
              <span>
                {app.utils.time2str(created_at, {showtime: 1})}
              </span>
            </p>
            <p class="rel" if={relation.length}>
              关联对象: <span each={relation}>{value_name}; </span>
            </p>
            <div class="content" if={app.utils.pureText(content).length<200}>
              <raw content="{content}"></raw>
            </div>
            <div if="{app.utils.pureText(content).length>=200}" class="content {fadein: unfold}">
              <raw if={unfold} content="{content}"></raw>
              {
                !unfold ? app.subText(app.utils.pureText(content), 200) : ''
              }
              <!-- 展开收起 -->
              <a class="under-line" onclick="{fn.unfold}" href="javascript:;">{unfold?'收起':'展开'}</a>
            </div>
            <div class="handle-line">
              <a href="javascript:;" onclick="{fn.read}" if={q.range=='information'} if="{myself}">标为已读</a>
              <a href="javascript:;" onclick="{fn.checkMsg}">评论({msgList[id].length})</a>
              <a href="javascript:;" onclick="{fn.edit}" if="{myself}">修改</a>
              <a href="javascript:;" onclick="{fn.remove}" if="{myself}">删除</a>
            </div>
            <div class="{fadein: checkMsgId==id}" if={checkMsgId==id}>
              <div class="comment">
                <input ref="comment" type="text" placeholder="评论 {msg.user_name}: {msg.content}" onkeyup="{fn.cmtKeyup}" maxlength="100">
                <!-- 复制内容获取坐标前的内容 -->
                <user-select if={parent.atX} for="admin" style="position: absolute; left: {parent.atX}px; top: 20px;" ref="atuser"/>
                <span class="count-px" ref="cloneTxt">{parent.cloneTxt}</span>
                <input-valid ref="validComment" for="comment" rule="required" msg=""/>
                <button type="button" onclick="{fn.send}">发送</button>
              </div>
              <ul class="comment-list">
                <li each={msgList[id]}>
                  <p>
                    <span class="blank" style="width: {Number(lv)*10}px"></span>
                    <span class="c-name">
                      <a href="javascript:;" onclick={fn.reply}  class="under-line">{data.user_name}</a>
                    </span>
                    <span if={lv>0} class="c-reply"> 回复 </span>
                    <span class="c-name">{pname}:</span>
                    <span class="c-content">{data.content}</span>
                    <span class="c-time">{app.utils.time2str(data.created_at, {showtime:1})}</span>
                    <a href="javascript:;" class="c-rm" if="{myself&&data.is_deleted==0}" onclick={fn.rmCmt}><i class="icon-cancel"></i></a>
                  </p>
                </li>
              </ul>
            </div>
          </div>

        </form>

        <pagination-number page={page} pages={pages} select="y"/>

      </section>
    </div>
  </main>

  <footer class="admin"></footer>

  <!-- 删除记录弹窗 -->
  <modal-remove/>

  <script>
  var _this = this;
  _this.q = _this.app.route.query;
  _this.q.range = _this.q.range || 'my';
  _this.section = this.app.route.params[1] || 'index';
  _this.checkMsgId = 0;
  _this.msg = {};
  _this.msgList = {};
  _this.rangeList = [
    {k: 'my', name: '与我相关'},
    {k: 'information', name: '新消息'},
    {k: 'all', name: '所有'},
    {k: 'department', name: '本部门'}
  ];
  _this.fn = {
    // 删除日志
    remove: function(e, name){
      _this.tags['modal-remove']
      .emit('open').once('ok', function(){
        _this.app.api('GET', 'daily-manager/default/delete', {
          data: { id: e.item.id||e.item.data.id }
        }).on('done', function(){
          _this.app.alert((name||'日志')+'删除成功', 'success');
          _this.fn.getDailyList();
        })
      });
    },
    rmCmt: function(e){
      _this.fn.remove(e, '评论');
    },
    cmtKeyup: function(e){
      _this.cloneTxt = e.target.value.slice(0, e.target.selectionEnd);
      if(e.shiftKey && e.keyCode == 50){
        _this.atX = (_this.refs.cloneTxt.clientWidth >
        _this.refs.comment.clientWidth ? _this.refs.comment.clientWidth : _this.refs.cloneTxt.clientWidth)+22;
        _this.update();
        _this.refs.atuser
        .emit('focus')
        .once('select', function(user){
          _this.refs.comment.value =
          _this.refs.comment.value.replace(
            _this.cloneTxt,
            _this.cloneTxt+user.real_name+' '
          );
          _this.refs.comment.focus();
          _this.update({ atX: 0 });
        });
      }
    },
    read: function(e){
      _this.app.api('GET', 'daily-manager/default/information', {
        trigger: e.target,
        data: {
          read: e.item.id
        }
      }).on('done', function(){
        _this.dailyList.splice(_this.dailyList.indexOf(e.item), 1);
        _this.app.data.unread -= 1;
        _this.update();
      });
    },
    unfold: function(e){
      e.item.unfold = !!!e.item.unfold;
    },
    edit: function(e){
      _this.app.route(_this.app.route.path + '/edit/' + e.item.id);
    },
    add: function(e){
      _this.app.route(_this.app.route.path + '/add');
    },
    send: function(e){
      _this.refs.validComment
      .once('invalid', function(){
        _this.app.alert('请填写回复内容', 'warning');
      })
      .once('valid', function(){
        _this.app.api('POST', 'daily-manager/default/create', {
          trigger: e.target,
          data: {
            data: JSON.stringify({
              reply_id: _this.msg.id,
              sign: _this.msg.sign,
              content: _this.refs.comment.value
            })
          }
        }).on('done', function(){
          _this.app.alert('回复成功', 'success');
          _this.fn.getDailyList();
        });
      }).emit('check');
    },
    reply: function(e){
      _this.msg = e.item.user_name ? e.item : e.item.data;
    },
    checkMsg: function(e){
      _this.checkMsgId =
      _this.checkMsgId == e.item.id ? 0 : e.item.id;
      _this.msg = {
        id: e.item.id,
        sign: e.item.sign,
        content: _this.app.subText(
          _this.app.utils.pureText(e.item.content), 20)
      }
    },
    /**
     * 扫描评论层次
     * @param  {[type]} did 日志id
     * @param  {[type]} child 子数据
     * @param  {[type]} lv 层级
     */
    scanMessage: function(did, child, lv, pname){
      _this.msgList[did] = _this.msgList[did] || [];
      child.forEach(function(c){
        _this.msgList[did].push({
          lv: lv, data: c, pname: pname || ''
        });
        if(c.child.length > 0){
          _this.fn.scanMessage(did, c.child, lv+1, c.user_name);
        }
      });
    },
    rangeChange: function(e){
      _this.q.range = e.item.k;
      _this.app.query();
    },
    getUnread: function(){
      // 获取未读新消息的数量
      if(_this.app.data.unread)
        return _this.app.data.unread;
      _this.app.api('GET', 'daily-manager/default/information')
      .on('done', function(data){
        _this.app.data.unread = data.counts.total_items;
        _this.update();
      });
    },
    getDailyList: function(e){
      var api = 'daily-manager/default/'+_this.q.range;
      _this.app.api('GET', api, {
        data: {
          page: _this.q.page || 1
        }
      }).on('done', function(data){
        _this.dailyList = data.items;
        _this.page = data.counts.page;
        _this.pages = data.counts.total_page;
        _this.items = data.counts.total_items;
        _this.msgList = {};
        if(_this.q.range === 'information'){
          _this.app.data.unread = data.counts.total_items;
        }
        data.items.forEach(function(daily){
          _this.fn.scanMessage(daily.id, daily.message, 0);
        });
        _this.update()
        _this.tags['pagination-number'].emit('render');
        _this.msg.content = '';
      });
    }
  };
  this.on('mount', function(){
    if(_this.section !== 'index') return;
    // 分页
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
    _this.fn.getDailyList();
    _this.fn.getUnread();
  });
  </script>

</fp-admin-daily>
