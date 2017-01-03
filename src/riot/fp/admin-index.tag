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
              <spinner-dot if="{!mounted}" top="50"/>
              <hc-pie-text if="{mounted}" ref="pjPie" w="130" h="130" color="orange" percent="{projectPercent}">
                <strong>{parent.projectPercent}%</strong><br>
                {parent.summary.project_current_year_total}/<span>{parent.summary.project_total}</span>
              </hc-pie-text>
            </div>
            <div class="pies">
              <p class="title">今年/历年协议总数</p>
              <spinner-dot if="{!mounted}" top="50"/>
              <hc-pie-text if="{mounted}" ref="agPie" w="130" h="130" color="blue" percent="{agreementPercent}">
                <strong>{parent.agreementPercent}%</strong><br>
                {parent.summary.agreement_current_year_total}/<span>{parent.summary.agreement_total}</span>
              </hc-pie-text>
            </div>
            <div class="donor-n">
              <p class="title">捐赠方总数</p>
              <spinner-dot if="{!mounted}" top="50"/>
              <br><br>
              <strong style="font-family: HelveticaNeue-Light" class="large-n">{summary.donor_total}</strong>
            </div>
            <div class="pay-n">
              <p class="title">今年到款总金额</p>
              <spinner-dot if="{!mounted}" top="30"/>
              <br>
              <strong if="{mounted}" class="large-n" style="font-family: HelveticaNeue-Light; text-indent: -10px">
                <small>￥</small>
                {summary.payment_current_year_total||0}
              </strong>
            </div>
            <div class="ag-n">
              <p class="title">今年签约总金额</p>
              <spinner-dot if="{!mounted}" top="30"/>
              <p class="cell">
                <span each="{summary.sign_current_year_price}">
                  <label>{label}:</label>
                  {amount}
                </span>
              </p>
            </div>
          </div>
          <div class="logs">
            <p class="title">系统日志</p>
            <spinner-dot if="{!mounted}" top="50"/>
            <ul class="item">
              <li each="{summary.system_logs}">
                <span style="width: 25%; font-size: 11px"  class="date">{app.utils.time2str(created_at,{showtime:2})}</span>
                <span class="user" style="width: 25%; font-size: 13px">{user_name}</span>
                <span class="desc" style="width: 49%;  font-size: 13px">{app.subText(description, 10)}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="row summary">
          <table class="base">
            <thead>
              <tr>
                <th width="100%" colspan="5" class="title">协议汇总</th>
              </tr>
              <tr>
                <th width="20%">类型</th>
                <th width="20%">本月协议（份）</th>
                <th width="20%">上月协议（份）</th>
                <th width="20%">本年协议（份）</th>
                <th width="20%">历年协议（份）</th>
              </tr>
            </thead>
            <tbody>
              <tr each="{ag in summary.agreement_daily}">
                <td>{ag.label}</td>
                <td>{ag.this_month}</td>
                <td>{ag.last_month}</td>
                <td>{ag.this_y}</td>
                <td>{ag.over_y}</td>
              </tr>
              <tr if={!summary.agreement_daily}>
                <td colspan="6"><spinner-dot/></td>
              </tr>
            </tbody>
          </table>

          <table class="base">
            <thead>
              <tr>
                <th width="100%" colspan="6" class="title">
                  项目汇总
                  <a href="javascript:;" onmouseenter="{fn.helpme}" onmouseleave="{fn.helpme}" class="under-line">
                    <i class="help">?</i> 帮助
                    <span show="{helpme}">
                      <b>已结束: </b>所有已结束的项目数<br>
                      <b>执行中: </b>所有执行中的项目数<br>
                      <b>未执行: </b>所有未执行的项目数<br>
                      <b>今年执行: </b>当年发起执行的项目数
                    </span>
                  </a>
                </th>
              </tr>
              <tr>
                <th width="20%">类型</th>
                <th width="16%">今年执行项目（个）</th>
                <th width="16%">已结束（个）</th>
                <th width="16%">进行中（个）</th>
                <th width="16%">未执行（个）</th>
                <th width="16%">历年项目数（个）</th>
              </tr>
            </thead>
            <tbody>
              <tr each="{pj in summary.project_daily}">
                <td>{pj.label}</td>
                <td>{pj.this_year}</td>
                <td>{pj.finished}</td>
                <td>{pj.running}</td>
                <td>{pj.wating}</td>
                <td>{pj.over_year}</td>
              </tr>
              <tr if={!summary.project_daily}>
                <td colspan="6"><spinner-dot/></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>

  <footer class="admin"></footer>

  <script>
  var _this = this;
  _this.summary = {};
  _this.helpme = false;
  _this.fn = {
    helpme: function(){
      _this.helpme = !!!_this.helpme;
    },
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