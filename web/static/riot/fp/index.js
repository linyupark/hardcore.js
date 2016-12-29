riot.tag2('fp-index', '', '', '', function(opts) {
  var _this = this;
  _this.role = _this.app.utils.cookie.get('role');
  _this.on('mount', function(){

    if(!_this.role){
      _this.app.route('login');
    }
    else{
      _this.app.route(_this.role==='admin'?'admin-index':'user-index');
    }
  });

});
