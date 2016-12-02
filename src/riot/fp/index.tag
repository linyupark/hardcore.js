<fp-index>

  <header></header>

  <h1>FP index</h1>
  <p>
    <a href="#!/login">login</a>
  </p>

  <pagination-number pages="40" page="10"><pagination-number>

  <footer></footer>

  <script>
  this.on('mount', () => {
    console.log('index mounted', this.app.tagMounted);
  });
  </script>

</fp-index>
