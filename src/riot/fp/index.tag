<fp-index>

  <header for="user"></header>

  <h1>FP index</h1>

  <p>
    <a href="#!login">login</a>
    <a href="#!user-index">user</a>
  </p>

  <upload-formdata></upload-formdata>

  <script>
  var _this = this;
  _this.on('mount', function(){
    // _this.tags['upload-formdata'].on('post', function(fd){
    //   _this.app.on('api::progress', function(p){
    //     console.log(p);
    //   });
    //   _this.app.api('POST', 'agreement/default/upload-file', {
    //     showProgress: true,
    //     formdata: true,
    //     data: fd
    //   }).then(function(data){
    //     console.log(data);
    //   });
    // });
  });

  </script>

</fp-index>
