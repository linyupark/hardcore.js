<fp-user-index>

  <style scoped>
  .title{background:#fff; text-align: left; font-size: 20px;}
  .title h4{border-left: 2px solid #E01B46; margin: 12px 0; padding-left: 20px;}
  </style>

  <header for="user"></header>

  <div class="solider-banner">
    <img src="{app.data.solider}">
    <div class="gradient"></div>
  </div>

  <main class="user">
    <div class="container center" style="min-height: 350px">
      <table class="base" style="width: 92%; margin: 25% 4% 0;">
        <thead>
          <tr>
            <th class="title" colspan="3">
              <h4>我的捐赠项目</h4>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th width="50%">项目名称</th>
            <th width="30%">项目进度</th>
            <th width="20%">到账金额(元)</th>
          </tr>
        </thead>
        <tbody>
          <tr each={tableList}>
            <td class="left">{name||'-'}</td>
            <td>{status}</td>
            <td>{payment_sum}</td>
          </tr>
          <tr if={!tableList}>
            <td colspan="3"><spinner-dot/></td>
          </tr>
        </tbody>
        <tfoot if={tableList}>
          <tr>
            <td class="left" colspan="3">
              捐赠汇总: 已捐赠项目
              <b>{total.project}</b>
              个 / 总金额
              <b>{total.amount}</b>
              元
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </main>

  <footer class="user"></footer>

  <script>
  var _this = this;
  _this.fn = {
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
    _this.fn.getList();
  });
  </script>

</fp-user-index>
