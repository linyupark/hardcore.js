<fp-login>

  <div class="row">
    <div class="col l6 push-l3 m6 push-m3 s12">
      <h4>请登录</h4>
      <p>
        <input placeholder="账号" type="text">
      </p>
      <p>
        <input placeholder="密码" type="password">
      </p>
      <p>
        <button class="btn">提交</button>
      </p>
    </div>
  </div>

  <script>
  this.fn = {
  };
  this.on('mount', () => {
    console.log('login mounted');
  });
  </script>

</fp-login>
