<fp-index>

  <header></header>

  <h1>FP index</h1>
  <p>
    <a href="#!/login">login</a>
  </p>

  <pagination-select pages="10" page="1"><pagination-select>

  <footer></footer>

  <script>
  this.on('mount', () => {
    console.log('index mounted', this.app.tagMounted);
  });
  </script>

</fp-index>
