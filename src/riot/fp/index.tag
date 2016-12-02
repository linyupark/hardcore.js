<fp-index>

  <header></header>

  <h1>FP index</h1>
  <p>
    <a href="#!/login">login</a>
  </p>

  <upload-base64 type="pic"></upload-base64>

  <pagination-number pages="40" page="10"><pagination-number>

  <footer></footer>

  <script>
  this.on('mount', () => {
    this.app.log('index mounted', this.app.tagMounted);
  });
  </script>

</fp-index>
