
<!-- 捐赠项目详情 -->
<fp-project-detail>
  <table class="base" style="width: 92%; margin: 25% 4% 0;">
    <thead>
      <tr>
        <th class="title" colspan="5">
          <h4>
            <a href="#!user-index" class="under-line">
              返回
            </a>
          </h4>
        </th>
      </tr>
    </thead>
    <thead>
      <tr>
        <th width="10%">序号</th>
        <th width="15%">项目编号</th>
        <th width="45%">名称</th>
        <th width="15%">项目起止日期</th>
        <th width="15%">项目状态</th>
      </tr>
    </thead>
    <tbody>
      <tr each={tableList}>
        <td>{id}</td>
        <td>{number}</td>
        <td>{name}</td>
        <td>{app.utils.time2str(created_at)} ~ {issue_at?app.utils.time2str(issue_at):'未结束'}</td>
        <td>{status}</td>
      </tr>
      <tr if={!tableList}>
        <td colspan="5"><spinner-dot/></td>
      </tr>
    </tbody>
    <tfoot if={tableList}>
      <tr>
        <td class="left" colspan="5">
          共 <b>{total_items}</b> 条记录
        </td>
      </tr>
    </tfoot>
  </table>
  <script>
  var _this = this;
  _this.tableList = [];
  _this.fn = {
    getDetail: function(){
      _this.app.api('GET', 'frontend/project/detail', {
        data: { id: _this.app.route.params[2] }
      }).on('done', function(data){
        _this.update({
          tableList: data.items,
          total_items: data.counts.total_items
        });
      });
    }
  };
  _this.on('mount', function(){
    _this.fn.getDetail();
  });
  </script>
</fp-project-detail>

<fp-user-index>

  <style scoped>
  .title{background:#fff; text-align: left; font-size: 16px;}
  .title h4{border-left: 2px solid #E01B46; margin: 12px 0; padding-left: 20px;}
  </style>

  <header for="user"></header>

  <div class="solider-banner">
    <img src="{app.data.solider}">
    <div class="gradient"></div>
  </div>

  <main class="user">
    <div class="container center" style="min-height: 350px">
      <table if="{section=='index'}" class="base" style="width: 92%; margin: 25% 4% 0;">
        <thead>
          <tr>
            <th class="title" colspan="4">
              <h4>我的捐赠项目</h4>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th width="40%">项目名称</th>
            <th width="30%">项目进度</th>
            <th width="20%">到账金额(元)</th>
            <th width="10%">查看</th>
          </tr>
        </thead>
        <tbody>
          <tr each={tableList}>
            <td class="left">{name||'-'}</td>
            <td>{status}</td>
            <td>{payment_sum}</td>
            <td><a href="javascript:;" class="under-line" onclick="{fn.view}">查看详细</a></td>
          </tr>
          <tr if={!tableList}>
            <td colspan="4"><spinner-dot/></td>
          </tr>
        </tbody>
        <tfoot if={tableList}>
          <tr>
            <td class="left" colspan="4">
              捐赠汇总: 已捐赠项目
              <b>{total.project}</b>
              个 / 总金额
              <b>{total.amount}</b>
              元
            </td>
          </tr>
        </tfoot>
      </table>
      <fp-project-detail if="{section=='view'}"/>
    </div>
  </main>

  <footer class="user"></footer>

  <script>
  var _this = this;
  _this.section = _this.app.route.params[1] || 'index';
  _this.fn = {
    view: function(e){
      _this.app.route(_this.app.route.path+'/view/'+e.item.project_id);
    },
    getList: function(){
      _this.app.api('GET', 'frontend/project/index', {
        data: {}
      }).on('done', function(data){
        _this.update({
          tableList: data.projects,
          total: data.total
        });
      });
    }
  };
  _this.on('mount', function(){
    if(_this.section !== 'index') return;
    _this.fn.getList();
  });
  </script>

</fp-user-index>
