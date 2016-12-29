riot.tag2('fp-admin-setting-place', '<header for="admin"></header><main class="admin"><div class="container"><admin-sidenav></admin-sidenav><section><h2>管理后台 &gt; 设置 &gt; 职务管理</h2><table-filter for="place"><yield to="addon"><button class="main" onclick="{parent.fn.add}"><i class="icon-plus"></i> 添加职务 </button></yield></table-filter><table class="base"><thead><tr><th width="20%">序号</th><th width="40%">职务名称</th><th width="20%">排序</th><th width="20%">{app.lang.admin.handle}</th></tr></thead><tbody><tr each="{tableList}"><td>{id}</td><td>{place_name}</td><td>{sort}</td><td><a href="javascript:;" aria-label="{app.lang.admin.handles.edit}" class="c-tooltip--top"><i onclick="{fn.edit}" class="btn-icon icon-pencil"></i></a><a href="javascript:;" aria-label="{app.lang.admin.handles.remove}" class="c-tooltip--top"><i onclick="{fn.remove}" class="btn-icon icon-trash"></i></a></td></tr><tr if="{!tableList}"><td colspan="4"><spinner-dot></spinner-dot></td></tr></tbody><tfoot if="{tableList}"><tr><td class="left" colspan="4"> {app.lang.admin.counts.items} <b>{items}</b> {app.lang.admin.counts.unit} </td></tr></tfoot></table><pagination-number page="{page}" pages="{pages}" select="y"></pagination-number></section></div></main><footer class="admin"></footer><modal-remove></modal-remove><modal ref="savePlace" w="400" h="260"><yield to="title"> {parent.place.id?\'修改\':\'添加\'}内容 </yield><yield to="content"><form class="modal"><div class="row"><p><label>职务名称</label><input ref="place_name" type="text" riot-value="{parent.place.place_name}"></p><p><label>排序</label><input ref="place_sort" type="text" riot-value="{parent.place.sort}"><input-valid style="left: 85px" ref="validPlace" for="place_name,place_sort" rule="required" msg="职务名称跟排序都为必填"></input-valid></p></div></form></yield><yield to="button"><button type="button" onclick="{parent.fn.ok}" class="btn-main">{app.lang.admin.btn.ok}</button></yield><yield to="close">{app.lang.admin.btn.cancel}</yield></modal>', '', '', function(opts) {
  var _this = this;
  _this.q = _this.app.route.query;
  _this.place = {};
  _this.fn = {
    remove: function(e){
      _this.tags['modal-remove']
      .once('ok', function(){
        _this.app.api('GET', 'system-setting/place/delete', {
          data: { id: e.item.id }
        }).on('done', function(){
          _this.app.alert('职务删除成功', 'success');
          _this.fn.getPlaceList();
        })
      })
      .emit('open');
    },
    ok: function(e){
      var api = _this.place.id ?
      'system-setting/place/update?id='+_this.place.id :
      'system-setting/place/create';
      _this.refs.savePlace.refs.validPlace
      .once('valid', function(){
        _this.app.api('POST', api, {
          trigger: e.target,
          data: {
            data: JSON.stringify({
              place_name: _this.refs.savePlace.refs.place_name.value,
              sort: _this.refs.savePlace.refs.place_sort.value
            })
          }
        })
        .once('done', function(){
          _this.app.alert('操作成功', 'success');
          _this.fn.getPlaceList();
          _this.refs.savePlace.emit('close');
        });
      })
      .emit('check');
    },
    edit: function(e){
      _this.place = e.item;
      _this.refs.savePlace.emit('open');
      _this.refs.savePlace.refs.validPlace.emit('msg', '');
    },
    add: function(){
      _this.place = {};

      _this.refs.savePlace.emit('open');
      _this.refs.savePlace.refs.validPlace.emit('msg', '');
    },
    getPlaceList: function(){
      _this.app.api('GET', 'system-setting/place/index', {
        data: {
          page: _this.q.page || 1
        }
      }).on('done', function(data){
        _this.update({
          tableList: data.items,
          page: data.counts.page,
          pages: data.counts.total_page,
          items: data.counts.total_items
        });
        _this.tags['pagination-number'].emit('render');
      });
    }
  };
  this.on('mount', function(){
    _this.fn.getPlaceList();
    _this.tags['pagination-number'].on('change', function(n){
      _this.q.page = n;
      _this.app.query();
    });
  })
});
