<fp-admin-index>

  <style scoped>
  </style>

  <header for="admin"></header>

  <main class="admin">
    <div class="container">
      <admin-sidenav></admin-sidenav>
      <section>
        <h2>管理后台 &gt; 总览</h2>
        <div class="row summary">
          <div class="amount">
            <div class="pies">
              <p class="title">今年/历年项目总数</p>
              <hc-pie-text if="{mounted}" ref="pjPie" w="130" h="130" color="orange" percent="{projectPercent}">
                <strong>{parent.projectPercent}%</strong><br>
                {parent.summary.project_current_year_total}/<span>{parent.summary.project_total}</span>
              </hc-pie-text>
            </div>
            <div class="pies">
              <p class="title">今年/历年协议总数</p>
              <hc-pie-text if="{mounted}" ref="agPie" w="130" h="130" color="blue" percent="{agreementPercent}">
                <strong>{parent.agreementPercent}%</strong><br>
                {parent.summary.agreement_current_year_total}/<span>{parent.summary.agreement_total}</span>
              </hc-pie-text>
            </div>
            <div class="donor-n">
              <p class="title">捐赠方总数</p>
              <br><br>
              <strong style="font-family: HelveticaNeue-Light" class="large-n">{summary.donor_total}</strong>
            </div>
            <div class="pay-n">
              <p class="title">今年到款总金额</p>
              <br>
              <strong class="large-n" style="font-family: HelveticaNeue-Light; text-align: left; text-indent: 12px">
                <small>￥</small>
                {summary.payment_current_year_total}
              </strong>
            </div>
            <div class="ag-n">
              <p class="title">今年签约总金额</p>
              <p class="cell">
                <span each="{summary.sign_current_year_price}">
                  <label>{label}:</label>
                  {amount}
                </span>
                <span each="{summary.sign_current_year_price}">
                  <label>{label}:</label>
                  {amount}
                </span>
              </p>
            </div>
          </div>
          <div class="logs">
            <p class="title">系统日志</p>
          </div>
        </div>
      </section>
    </div>
  </main>

  <footer class="admin"></footer>

  <script>
  var _this = this;
  _this.summary = {};
  _this.fn = {
    getSummary: function(){
      _this.app.api('GET', 'backend/default/index')
      .on('done', function(data){
        _this.update({
          mounted: true,
          summary: data,
          projectPercent: Math.floor(Number(data.project_current_year_total)/Number(data.project_total)*100),
          agreementPercent: Math.floor(Number(data.agreement_current_year_total)/Number(data.agreement_total)*100)
        });
      });
    }
  };
  _this.on('mount', function(){
    _this.app.addResources('highcharts')
    .then(function(){
      _this.fn.getSummary();
    });
  });
  </script>

</fp-admin-index>
