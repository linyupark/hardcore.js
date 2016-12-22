<daily-form></daily-form>

<fp-admin-daily>

  <style scoped>
  .fadein{
    animation: fadeIn .5s;
  }
  </style>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <daily-form if={section=='add'}/>
      <daily-form if={section=='edit'}/>
      <section if={section=='index'}>
        <h2>工作日志</h2>
        <form class="user-daily" onsubmit="return false">
          <div class="top-tab-line">
            <a href="javascript:;" onclick={fn.rangeChange} class="c4 {active: k==parent.q.range}" each={rangeList}>{name}</a>
          </div>
          <table-filter for="daily">
            <yield to="addon">
              <button type="button" class="main" onclick={parent.fn.add}>
                <i class="icon-plus"></i> 添加新日志
              </button>
            </yield>
          </table-filter>

          <!-- 日志列表 -->
          <div each={dailyList} class="daily-box">
            <p class="user-date">
              <strong>{user_name}</strong>
              <span>
                {app.utils.time2str(created_at, {showtime: 1})}
              </span>
            </p>
            <div class="content">
              {
                content.length>200 && !unfold ?
                app.subText(content, 200) :
                content
              }
            </div>
            <div class="handle-line">
              <a href="javascript:;" if={q.range=='information'}>标为已读</a>
              <a href="javascript:;" onclick="{fn.checkMsg}">评论({msgList[id].length})</a>
              <a href="javascript:;">修改</a>
            </div>
            <div class="{fadein: checkMsgId==id}" if={checkMsgId==id}>
              <div class="comment">
                <input ref="comment" type="text" placeholder="回复 {msg.user_name}: {msg.content}">
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
                    <a href="javascript:;" class="c-rm" onclick={fn.rmCmt}><i class="icon-cancel"></i></a>
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
      _this.msg = e.item;
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
  });
  </script>

</fp-admin-daily>
