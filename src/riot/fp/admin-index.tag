<fp-admin-index>

  <header for="admin"></header>

  <main class="admin">
    <h1>管理员首页</h1>
    <ul>
      <li><a href="#!admin-agreement">协议管理</a></li>
    </ul>
  </main>

  <footer></footer>

  <script>
  var _this = this;
  this.on('mount', function(){
    setTimeout(function(){
      _this.app.emit('alert', 'aaaa');
    }, 1000);
  })

  </script>

</fp-admin-index>
