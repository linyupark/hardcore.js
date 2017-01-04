
riot.tag2('hc-pie-text', '<div class="wrapper"><div ref="pie" riot-style="width: {opts.w}px; height: {opts.h}px"></div><div class="text"><yield></yield></div></div>', 'hc-pie-text .wrapper,[data-is="hc-pie-text"] .wrapper{position: relative;} hc-pie-text .wrapper .text,[data-is="hc-pie-text"] .wrapper .text{position: absolute;}', '', function(opts) {
  var _this = this;
  _this.colors = {
    'orange': {
      radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
      stops: [
        [0, '#FF8055'],
        [1, '#FB6366']
      ]
    },
    'blue': {
      radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
      stops: [
        [0, '#58B6ED'],
        [1, '#3494F4']
      ]
    }
  };
  _this.fn = {};
  _this.on('mount', function(){
    Highcharts.chart(_this.refs.pie, {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'none'
      },
      credits: false,
      title: {
        text: ''
      },
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{
          outerRadius: '118%',
          innerRadius: '88%',
          backgroundColor: opts.bgcolor||'#f3f3f3',
          borderWidth: 0
        }]
      },
      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },
      plotOptions: {
        solidgauge: {
          borderWidth: '13px',
          dataLabels: {
            enabled: false
          },
          stickyTracking: false
        }
      },
      tooltip: {
        enabled: false
      },
      series: [{
        borderColor: _this.colors[opts.color||'orange'],
        data: [{
          radius: '100%',
          innerRadius: '100%',
          y: Number(opts.percent)||0
        }]
      }]
    });
  });
});


riot.tag2('tinymce-editor', '<textarea></textarea>', 'tinymce-editor [aria-label]:hover:after,[data-is="tinymce-editor"] [aria-label]:hover:after,tinymce-editor [aria-label]:focus:after,[data-is="tinymce-editor"] [aria-label]:focus:after{ display: none; }', '', function(opts) {
  var _this = this;
  _this.getContent = function(){
    return tinymce.activeEditor.getContent();
  };
  _this.fn = {};
  _this.on('mount', function(){
    tinymce.init({
      selector: "textarea",
      width: opts.w,
      height: opts.h,
      language: "zh_CN",
      menubar: false,
      statusbar: false,
      forced_root_block : "",
      force_br_newlines : true,
      force_p_newlines : false,
      init_instance_callback: function(ed){
        _this.trap('inited', ed);
        ed.on('keyup', function(e){
          var pos = ed.selection.getRng().getClientRects()[0];
          _this.emit('keyup', e, {
            edit: ed,
            pos: {
              x: pos && pos.left || 0,
              y: pos && pos.top || 0
            }
          });
        });
      }
    });
  });

  _this.on('setContent', function(content){
    var eda = tinymce.activeEditor;
    eda.setContent(content);
    eda.selection.select(eda.getBody(), true);
    eda.selection.collapse(false);
    eda.focus();
  });
  _this.on('insertContent', function(content){
    tinymce.activeEditor.insertContent(content);
  });
});



riot.tag2('modal-agreement', '<modal ref="modal" w="640" h="520" top="15%"><yield to="title">选择新增协议</yield><yield to="content"><table-filter ref="filter" for="agreement" modal="true"></table-filter><br><table class="base" style="min-height: 255px"><thead><tr><th width="10%">关联</th><th width="30%">{app.lang.admin.project.number}</th><th width="60%">{app.lang.admin.agreement.name}</th></tr></thead><tbody><tr each="{parent.tableList}"><td><input onclick="{parent.parent.fn.addIds}" type="checkbox" checked="{parent.parent.ids.indexOf(id)!=-1}"></td><td>{agreement_number}</td><td class="left">{app.subText(agreement_name, 20)}</td></tr><tr if="{!parent.tableList}"><td colspan="3"><spinner-dot></spinner-dot></td></tr><tr if="{parent.tableList && parent.tableList.length==0}"><td colspan="3">没有可添加关联的协议</td></tr></tbody></table><pagination-number ref="page" page="{parent.page}" pages="{parent.pages}" select="y"></pagination-number></yield><yield to="button"><button type="button" onclick="{parent.fn.addAgreement}" class="btn-main">{app.lang.admin.btn.ok}</button></yield><yield to="close">{app.lang.admin.btn.cancel}</yield></modal>', '', '', function(opts) {
  var _this = this;
  _this.q = {};

  _this.ids = [];
  _this.fn = {
    addAgreement: function(){

      _this.app.api('POST', 'project/agreement/create?id='+opts.pid, {
        data: {
          data: JSON.stringify(_this.ids)
        }
      }).on('done', function(data){
        _this.app.alert('协议关联添加成功', 'success');
        _this.refs.modal.emit('close');
        _this.emit('added');
      });
    },
    addIds: function(e){
      if(e.target.checked){
        _this.ids.push(e.item.id);
      } else{
        _this.ids.splice(_this.ids.indexOf(e.item.id), 1);
      }
    },
    getList: function(){
      _this.update({
        tableList: false
      });
      _this.app.api('GET', 'project/agreement/search', {
        data: {
          page: _this.q.page || 1,
          search_type: _this.q.type || '',
          search_keyword: _this.q.keyword || '',
          per_page: 5
        }
      }).on('done', function(data){
        _this.update({
          tableList: data.items,
          page: data.counts.page,
          pages: data.counts.total_page,
          items: data.counts.total_items
        });
        _this.refs.modal.refs.page &&
        _this.refs.modal.refs.page.emit('render');
      });
    }
  };
  _this.on('mount', function(){

    _this.fn.getList();

    _this.on('open', function(){

      _this.refs.modal.emit('open');

      _this.refs.modal.refs.page.on('change', function(n){
        _this.q.page = n;
        _this.fn.getList();
      });

      _this.refs.modal.refs.filter.on('query', function(q){
        _this.q = q;
        _this.fn.getList();
      });

    });

  });

});



riot.tag2('modal-remove', '<modal><yield to="title">{app.lang.admin.confirm.tips}</yield><yield to="content">{app.lang.admin.confirm.delete}</yield><yield to="button"><button type="button" onclick="{parent.fn.ok}" class="btn-main">{app.lang.admin.btn.ok}</button></yield><yield to="close">{app.lang.admin.btn.cancel}</yield></modal>', '', '', function(opts) {
  var _this = this;
  _this.fn = {
    ok: function(){
      _this.emit('ok');
      _this.tags.modal.emit('close');
    }
  };
  _this.on('open', function(){
    _this.tags.modal.emit('open');
  });
  _this.on('close', function(){
    _this.tags.modal.emit('close');
  });
});



riot.tag2('agreement-select', '<input-select name="agreement_name" ref="agreement_name" placeholder="搜索协议" value=""></input-select><input type="hidden" ref="agreement_id" value=""><input-valid riot-style="{opts.left&&\'left:\'+opts.left+\'px\'}" ref="validAgreement" for="agreement_id" rule="required" msg="请选择协议"></input-valid>', '', '', function(opts) {
  var _this = this;
  _this.keywordCache = {};

  _this.getId = function(){
    return _this.refs.agreement_id.value;
  };
  _this.getName = function(){
    return _this.refs.agreement_name.value;
  };
  _this.on('mount', function(){

    if(opts.disable == 1){
      _this.refs.agreement_name.emit('disable');
      return;
    }

    _this.refs.agreement_name.on('pull', function(keyword){

      _this._oldValues = {
        id: _this.refs.agreement_id.value||'',
        agreement_name: _this.refs.agreement_name.value||''
      };

      _this.refs.validAgreement.emit('msg', '');

      if(_this.keywordCache[keyword]){
        return _this.refs.agreement_name.emit(
          'push', _this.keywordCache[keyword]
        );
      }
      _this.app.api('GET', 'project/agreement/search', {
        data: {
          search_type: 'agreement_name',
          search_keyword: keyword,
          per_page: 99999
        }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.agreement_name.emit('push', data.items);
      });

    });

    _this.refs.agreement_name.on('select', function(item){
      if(item.id){
        _this._oldValues = item;
      }
      _this.refs.agreement_id.value = item.id || _this._oldValues.id;
      _this.refs.agreement_name.value = item.agreement_name || _this._oldValues.agreement_name;
      _this.refs.agreement_name.emit('value', _this.refs.agreement_name.value);
    });
  });

  _this.on('check', function(){
    _this.refs.validAgreement
    .on('valid', function(){
      _this.emit('valid');
    })
    .on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });

  _this.on('set', function(item){
    _this.refs.agreement_id.value = item.id;
    _this.refs.agreement_name.emit('value', item.name);
  });
});


riot.tag2('user-select', '<input-select name="real_name" ref="user_name" placeholder="搜索选择用户" value=""></input-select><input type="hidden" ref="user_id" value=""><input-valid riot-style="{opts.left&&\'left:\'+opts.left+\'px\'}" ref="validUser" for="user_id" rule="required" msg="请选择用户"></input-valid>', '', '', function(opts) {
  var _this = this;
  _this.keywordCache = {};

  _this.getId = function(){
    return _this.refs.user_id.value;
  };
  _this.getName = function(){
    return _this.refs.user_name.value;
  };
  _this.on('mount', function(){

    if(opts.disable == 1){
      _this.refs.user_name.emit('disable');
      return;
    }

    _this.refs.user_name.on('pull', function(keyword){

      _this._oldValues = {
        user_id: _this.refs.user_id.value||'',
        real_name: _this.refs.user_name.value||''
      };

      _this.refs.validUser.emit('msg', '');

      if(_this.keywordCache[keyword]){
        return _this.refs.user_name.emit(
          'push', _this.keywordCache[keyword]
        );
      }
      _this.app.api('GET', 'user-manager/default/search', {
        data: {
          identity: opts.for=='admin' ? 1: 0,
          keyword: keyword
        }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.user_name &&
        _this.refs.user_name.emit('push', data.items);
      });

    });

    _this.refs.user_name.on('select', function(item){
      if(item.user_id){
        _this._oldValues = item;
      }
      _this.refs.user_id.value = item.user_id || _this._oldValues.user_id;
      _this.refs.user_name.value = item.real_name || _this._oldValues.real_name;
      _this.refs.user_name.emit('value', _this.refs.user_name.value);
      _this.emit('select', {
        user_id: _this.refs.user_id.value,
        real_name: _this.refs.user_name.value
      });
    });
  });

  _this.on('check', function(){
    _this.refs.validUser
    .on('valid', function(){
      _this.emit('valid');
    })
    .on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });

  _this.on('set', function(item){
    _this.refs.user_id.value = item.id;
    _this.refs.user_name.emit('value', item.name);
  });
  _this.on('focus', function(){
    _this.refs.user_name.refs.keyword.focus();
  });
});


riot.tag2('org-select', '<select ref="orgs" each="{id, lv in selectValue}" if="{selectList[id] && selectList[id].length}" onchange="{fn.change}"><option selected="{Number(selectValue[lv+1])===id}" riot-value="{id}" each="{selectList[id]}">{name}</option></select><input type="hidden" ref="org_id" riot-value="{selectValue.slice(-1)[0]}"><input-valid riot-style="{opts.left&&\'left:\'+opts.left+\'px\'}" ref="validOrg" for="org_id" rule="required" msg=""></input-valid>', 'org-select select,[data-is="org-select"] select{margin-right: 12px}', '', function(opts) {
  var _this = this;
  _this.orgList = _this.app.data.orgList || [];
  _this.selectList = {};

  _this.selectValue = [0];

  _this.getId = function(){
    return _this.selectValue.slice(-1)[0];
  };
  _this.fn = {
    change: function(e){
      var nextLv = Number(e.item.lv) + 1;
      _this.refs.validOrg.emit('msg', '');
      _this.selectValue[nextLv] = Number(e.target.value);

      while(_this.selectValue.length > nextLv + 1){
        _this.selectValue.pop();
      }
      _this.update();
    },

    scan: function(id, lv, data){
      var parentId = id || 0;
      var level = lv || 0;
      var list = [{
        lv: level, id: -1, name: '--选择结构--'
      }];
      var orgList = data || _this.orgList;
      orgList.forEach(function(org, i){
        if(org.child.length > 0){
          _this.fn.scan(org.id, level+1, org.child);
        }
        list.push({
          lv: level, id: org.id, name: org.name
        });
      });
      _this.selectList[parentId] = list;
    }
  };
  _this.on('mount', function(){
    if(_this.orgList.length > 0){
      _this.fn.scan();
      return _this.update();
    }
    _this.app.api('GET', 'system-setting/organization/search')
    .on('done', function(data) {
      _this.app.data.orgList = data.items;
      _this.orgList = data.items;
      _this.fn.scan();
      _this.update();
    });
  });

  _this.on('check', function(){
    var id = _this.selectValue.slice(-1)[0];
    if(_this.selectList[id] || id === -1 || id == ''){
      _this.emit('invalid');
      return _this.refs.validOrg.emit('msg', '请继续选择');
    }
    _this.emit('valid');
  });

  _this.on('set', function(value){
    _this.selectValue = [0].concat((''+value).split(','));
    _this.update();
  });
});



riot.tag2('project-select', '<input-select name="name" ref="project" placeholder="搜索项目" value=""></input-select><input type="hidden" ref="project_id" value=""><input-valid riot-style="{opts.left&&\'left:\'+opts.left+\'px\'}" ref="validProject" for="project_id" rule="required" msg="请选择项目"></input-valid>', '', '', function(opts) {
  var _this = this;
  _this.keywordCache = {};

  _this.getId = function(){
    return _this.refs.project_id.value;
  };
  _this.getName = function(){
    return _this.refs.project.value;
  };
  _this.on('mount', function(){

    if(opts.disable == 1){
      _this.refs.project.emit('disable');
      return;
    }

    _this.refs.project.on('pull', function(keyword){

      _this._oldValues = {
        id: _this.refs.project_id.value||'',
        name: _this.refs.project.value||''
      };

      _this.refs.validProject.emit('msg', '');

      if(_this.keywordCache[keyword]){
        return _this.refs.project.emit(
          'push', _this.keywordCache[keyword]
        );
      }
      _this.app.api('GET', 'project/default/search', {
        data: { keyword: keyword }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.project.emit('push', data.items);
      });

    });

    _this.refs.project.on('select', function(item){
      if(item.id){
        _this._oldValues = item;
      }
      _this.refs.project_id.value = item.id || _this._oldValues.id;
      _this.refs.project.value = item.name ||_this._oldValues.name;
      _this.refs.project.emit('value', _this.refs.project.value);
    });

  });

  _this.on('check', function(){
    _this.refs.validProject
    .on('valid', function(){
      _this.emit('valid');
    })
    .on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });

  _this.on('set', function(item){
    _this.refs.project_id.value = item.id || '';
    _this.refs.project.value = item.name || '';
    _this.refs.project.emit('value', item.name || '');
  });

});


riot.tag2('project-type-select', '<input-select name="name" ref="project_type" placeholder="搜索项目类型" value=""></input-select><input type="hidden" ref="project_type_id" value=""><input-valid riot-style="{opts.left&&\'left:\'+opts.left+\'px\'}" ref="validProjectType" for="project_type_id" rule="required" msg="请选择项目类型"></input-valid>', '', '', function(opts) {
  var _this = this;
  _this.keywordCache = {};

  _this.getId = function(){
    return _this.refs.project_type_id.value;
  };
  _this.getName = function(){
    return _this.refs.project_type.value;
  };
  _this.on('mount', function(){

    if(opts.disable == 1){
      _this.refs.project_type.emit('disable');
      return;
    }

    _this.refs.project_type.on('pull', function(keyword){

      _this._oldValues = {
        name: _this.refs.project_type.value||'',
        id: _this.refs.project_type_id.value||''
      };

      _this.refs.validProjectType.emit('msg', '');

      if(_this.keywordCache[keyword]){
        return _this.refs.project_type.emit(
          'push', _this.keywordCache[keyword]
        );
      }
      _this.app.api('GET', 'system-setting/project-type/search', {
        data: { keyword: keyword }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.project_type.emit('push', data.items);
      });

    });

    _this.refs.project_type.on('select', function(item){
      if(item.id){
        _this._oldValues = item;
      }
      _this.refs.project_type_id.value = item.id || _this._oldValues.id;
      _this.refs.project_type.value = item.name || _this._oldValues.name;
      _this.refs.project_type.emit('value', _this.refs.project_type.value);
    });

  });

  _this.on('check', function(){
    _this.refs.validProjectType
    .on('valid', function(){
      _this.emit('valid');
    })
    .on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });

  _this.on('set', function(item){
    var id = _this.refs.project_type_id.value = item.id;
    _this.app.api('GET', 'system-setting/project-type/search')
    .on('done', function(data){
      data.items.forEach(function(item){
        if(item.id == id){
          _this.refs.project_type &&
          _this.refs.project_type.emit('value', item.name);
        }
      });
    });
  });

});



riot.tag2('role-select', '<input-select name="description" ref="description" placeholder="搜索选择角色" value=""></input-select><input type="hidden" ref="name" value=""><input-valid riot-style="{opts.left&&\'left:\'+opts.left+\'px\'}" ref="validRole" for="name" rule="required" msg="请选角色"></input-valid>', '', '', function(opts) {
  var _this = this;
  _this.keywordCache = {};

  _this.getDescription = function(){
    return _this.refs.description.value;
  };
  _this.getName = function(){
    return _this.refs.name.value;
  };
  _this.on('mount', function(){

    _this.refs.description.on('pull', function(keyword){

      _this._oldValues = {
        name: _this.refs.name.value||'',
        description: _this.refs.description.value||''
      };
      _this.refs.validRole.emit('msg', '');
      if(_this.keywordCache[keyword]){
        return _this.refs.description.emit(
          'push', _this.keywordCache[keyword]
        );
      }
      _this.app.api('GET', 'role-manager/default/search', {
        data: { keyword: keyword }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.description.emit('push', data.items);
      });

    });

    _this.refs.description.on('select', function(item){
      if(item.name){
        _this._oldValues = item;
      }
      _this.refs.name.value = item.name || _this._oldValues.name;
      _this.refs.description.value = item.description || _this._oldValues.description;
      _this.refs.description.emit('value', _this.refs.description.value);
    });
  });

  _this.on('check', function(){
    _this.refs.validRole
    .on('valid', function(){
      _this.emit('valid');
    }).on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });

  _this.on('set', function(item){
    _this.refs.name.value = item.name;
    _this.refs.description.value = item.description;
    _this.refs.description.emit('value', item.description || ' ');
  });
});


riot.tag2('place-select', '<input-select name="place_name" ref="place_name" placeholder="搜索选择职务" value=""></input-select><input type="hidden" ref="place_id" value=""><input-valid riot-style="{opts.left&&\'left:\'+opts.left+\'px\'}" ref="validPlace" for="place_id" rule="required" msg="请选择职务"></input-valid>', '', '', function(opts) {
  var _this = this;
  _this.keywordCache = {};

  _this.getId = function(){
    return _this.refs.place_id.value;
  };
  _this.getName = function(){
    return _this.refs.place_name.value;
  };
  _this.on('mount', function(){

    _this.refs.place_name.emit('value', opts.place_name||'');

    _this.refs.place_name.on('pull', function(keyword){

      _this._oldValues = {
        id: _this.refs.place_id.value||'',
        place_name: _this.refs.place_name.value||''
      };
      _this.refs.validPlace.emit('msg', '');
      if(_this.keywordCache[keyword]){
        return _this.refs.place_name.emit(
          'push', _this.keywordCache[keyword]
        );
      }
      _this.app.api('GET', 'system-setting/place/search', {
        data: { keyword: keyword }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.place_name.emit('push', data.items);
      });

    });

    _this.refs.place_name.on('select', function(item){
      if(item.id){
        _this._oldValues = item;
      }
      _this.refs.place_id.value = item.id || _this._oldValues.id;
      _this.refs.place_name.value = item.place_name || _this._oldValues.place_name;
      _this.refs.place_name.emit('value', _this.refs.place_name.value);
    });
  });

  _this.on('check', function(){
    _this.refs.validPlace
    .on('valid', function(){
      _this.emit('valid');
    }).on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });

  _this.on('set', function(place){
    _this.refs.place_id.value = place.id;
    _this.refs.place_name.value = place.name;
    _this.refs.place_name.emit('value', place.name || ' ');
  });
});



riot.tag2('donor-select', '<input-select name="donor_name" ref="donor_name" placeholder="搜索捐赠方"></input-select><input type="hidden" ref="donor_id" value=""><input-valid riot-style="{opts.left&&\'left:\'+opts.left+\'px\'}" ref="validDonor" for="donor_id" rule="required" msg="请选择捐赠方"></input-valid>', '', '', function(opts) {
  var _this = this;
  _this.keywordCache = {};

  _this.getId = function(){
    return _this.refs.donor_id.value;
  };
  _this.on('mount', function(){

    _this.refs.donor_name.on('pull', function(keyword){

      _this._oldValues = {
        id: _this.refs.donor_id.value||'',
        name: _this.refs.donor_name.value||''
      };

      _this.refs.validDonor.emit('msg', '');

      if(_this.keywordCache[keyword]){
        return _this.refs.donor_name.emit(
          'push', _this.keywordCache[keyword]
        );
      }

      _this.app.api('GET', 'donor/default/search', {
        data: { keyword: keyword }
      }).on('done', function(data){
        _this.keywordCache[keyword] = data.items;
        _this.refs.donor_name.emit('push', data.items);
      });

    });

    _this.refs.donor_name.on('select', function(item){
      if(item.id){
        _this._oldValues = item;
      }
      _this.refs.donor_id.value = item.id||_this._oldValues.id;
      _this.refs.donor_name.value = item.donor_name|| _this._oldValues.name;
      _this.refs.donor_name.emit('value', _this.refs.donor_name.value);
    });
  });

  _this.on('check', function(){
    _this.refs.validDonor
    .on('valid', function(){
      _this.emit('valid');
    }).on('invalid', function(){
      _this.emit('invalid');
    })
    .emit('check');
  });

  _this.on('set', function(donor){
    _this.refs.donor_id.value = donor.id;
    _this.refs.donor_name.value = donor.name;
    _this.refs.donor_name.emit('value', donor.name||'');
  })
});



riot.tag2('admin-sidenav', '<ul><li each="{m in data}"><a href="{m.child?\'javascript:;\':\'#!\'+m.url}" onclick="{fn.toggle}" class="{active: new RegExp(m.url).test(parent.url)}"><i class="icon-{m.icon}"></i> {m.name} <i class="{\'icon-menu\': m.child==parent.child,         \'icon-angle-down\': m.child&&parent.child!=m.child}" if="{m.child}"></i></a><ul if="{m.child}" class="child {unfold: parent.child==m.child}"><li each="{s in m.child}"><a href="#!{s.url}" class="{active: new RegExp(s.url).test(parent.url)}"><i class="icon-{s.icon}"></i> {s.name} </a></li></ul></li></ul>', 'admin-sidenav .child,[data-is="admin-sidenav"] .child{display: none} admin-sidenav .unfold,[data-is="admin-sidenav"] .unfold{display: block} admin-sidenav .icon-angle-down,[data-is="admin-sidenav"] .icon-angle-down,admin-sidenav .icon-menu,[data-is="admin-sidenav"] .icon-menu{float: right; margin-right: 20px; color: #666;}', '', function(opts) {
  var _this = this;
  _this.data = _this.app.lang.admin.sidenav;
  _this.fn = {
    toggle: function(e){
      if(e.item.m.child){
        if(e.item.m.child == _this.child){

          delete _this.child;
        }
        else{
          _this.child = e.item.m.child;
        }
      }
    }
  };
  _this.on('mount', function(){
    window.scrollTo(0, 0);

    _this.url = _this.app.route.params[0] || 'admin-index';

    _this.app.lang.admin.sidenav.forEach(function(item){
      if(new RegExp(item.url).test(_this.url) && item.child){
        _this.child = item.child;
      }
    });
    _this.update();
  });

});


riot.tag2('table-filter', '<div if="{opts.for==\'daily\'&&app.route.query.range==\'all\'}"> 关键词: <input type="text" ref="keyword" style="width: 250px" riot-value="{keyword}" onclick="this.select()" onkeyup="{fn.enter}" placeholder="输入部门、院系名称进行搜索"><button onclick="{fn.search}" type="button" class="btn-gray"><i class="icon-search"></i></button><a show="{app.route.query.keyword}" href="javascript:;" onclick="{fn.dailyReset}">{app.route.query.keyword}x</a></div><div if="{opts.for==\'project\'}"> 执行状态： <a class="tab-sub {active: app.route.query.status==key}" href="javascript:;" onclick="{fn.tab}" each="{projectStatusList}">{name}</a></div><div if="{opts.for==\'agreement\'}"> {app.lang.admin.search.condition}: <select ref="agreement"><option each="{app.lang.admin.agreement[\'search:types\']}" riot-value="{key}" selected="{key==type}">{name}</option></select><input type="text" ref="keyword" riot-value="{keyword}" onclick="this.select()" onkeyup="{fn.enter}" placeholder="{app.lang.admin.search.keyword.placehoder}"><button onclick="{fn.search}" type="button" class="btn-gray"><i class="icon-search"></i></button><a show="{app.route.query.keyword}" href="javascript:;" onclick="{fn.agreementReset}">{app.lang.admin.reset}</a></div><div class="addon"><yield from="addon"></yield></div>', '', '', function(opts) {
  var _this = this;
  _this.projectStatusList = [{
    name: "全部", key: "all"
  }].concat(_this.app.lang.admin.project['filter:status']);
  _this.fn = {
    tab: function(e){
      _this.app.route.query.status = e.item.key;
      _this.app.query();
    },
    dailyReset: function(){
      _this.app.route.query.keyword = '';
      _this.app.query();
    },
    agreementReset: function(){
      _this.refs.agreement.value = 'agreement_number';
      _this.app.route.query.page = 1;
      _this.app.route.query.type =
      _this.app.route.query.page =
      _this.refs.keyword.value =
      _this.app.route.query.keyword = '';
      if(opts.modal){
        _this.emit('query', _this.app.route.query);
        return;
      }
      _this.app.query();
    },
    enter: function(e){
      if(e.keyCode == 13){
        _this.fn.search();
      }
    },
    search: function(){
      if(opts.for === 'daily'){

        _this.app.route.query.keyword =  _this.refs.keyword.value || '';
      }
      if(opts.for === 'agreement'){

        _this.app.route.query.type =
        _this.refs.agreement.value || '';
        _this.app.route.query.keyword =  _this.refs.keyword.value || '';
      }
      if(opts.modal){
        _this.emit('query', _this.app.route.query);
        return;
      }
      _this.app.query();
    }
  };
  _this.on('mount', function(){
    if(opts.for === 'agreement'){
      _this.type = _this.app.route.query.type;
      _this.keyword = _this.app.route.query.keyword;
    }
    if(opts.for === 'daily'){
      _this.keyword = _this.app.route.query.keyword;
    }
    if(opts.for === 'project'){
      _this.app.route.query.status =
      _this.app.route.query.status || '';
    }
    _this.update();
  });
});


riot.tag2('userinfo', '<div class="username" onmouseenter="{fn.active}" onmouseover="{fn.active}" onmouseleave="{fn.hidden}"><a href="javascript:;" class="{active: active}"> {app.data.user_name} <i class="{\'icon-angle-down\': !active, \'icon-menu\': active}"></i></a><dl class="menu {active: active}" onmouseenter="{fn.active}" onmouseover="{fn.active}" onmouseleave="{fn.hidden}"><dd><a href="#!account">{app.lang.header.userinfo.account}</a></dd><dd><a href="javascript:;" onclick="{fn.logout}">{app.lang.header.userinfo.logout}</a></dd></dl></div>', '', '', function(opts) {

  var _this = this;

  _this.active = false;
  _this.logoutApi = opts.role == 'user' ?
  'frontend/default/logout' : 'backend/default/logout';
  _this.infoApi = opts.role == 'user' ?
  'frontend/default/user-info' : 'backend/default/user-info';
  _this.fn = {
    logout: function(e){
      _this.app.api('GET', _this.logoutApi, {
        trigger: e.target,
      })
      .on('done', function(data){
        _this.app.utils.cookie.remove('user_name');
        _this.app.utils.cookie.remove('user_id');
        _this.app.utils.cookie.remove('role');
        _this.app.alert(_this.app.lang.login.out, 'success');
        _this.app.route(_this.app.config.loginPage);
      });
    },

    active: function(){
      clearTimeout(_this.timer);
      _this.active = true;
    },
    hidden: function(){
      clearTimeout(_this.timer);
      _this.timer = setTimeout(function(){
        _this.active = false;
        _this.update();
      }, 800);
    }
  };

  _this.on('mount', function(){

    if(_this.app.utils.cookie.get('user_name')){
      _this.app.data.user_name = _this.app.utils.cookie.get('user_name');
      _this.app.data.user_id = _this.app.utils.cookie.get('user_id');
    }
    else{

      _this.app.api('GET', _this.infoApi)
      .on('done', function(data){
        _this.app.data.user_name = data.user_name;
        _this.app.data.user_id = data.user_id;
        _this.app.utils.cookie.set('user_name', data.user_name);
        _this.app.utils.cookie.set('user_id', data.user_id);
        _this.update();
      })

    }
    _this.update();
  });
});


riot.tag2('footer', '<div class="container"><p class="info"> {app.lang.footer.icp} &copy; {app.lang.footer.copyright} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {app.lang.footer.address} &nbsp;&nbsp;&nbsp;&nbsp; {app.lang.footer.tel} </p></div>', '', '', function(opts) {
  var _this = this;
  _this.on('mount', function(){

    var inputs = document.getElementsByTagName('input') || [];
    for(var i in inputs){
      if(inputs[i].maxLength === -1)
        inputs[i].maxLength = 50;
    }
  });
});


riot.tag2('header', '<alert></alert><div class="container {center: opts.for!==\'admin\'}"><div class="row" if="{opts.for===\'login\'}"><h1> {app.lang.header.sitename} </h1></div><div class="row" if="{opts.for===\'user\'}"><h1> {app.lang.header.sitename} </h1><userinfo role="user"></userinfo></div><div class="row" if="{opts.for===\'admin\'}"><h1> {app.lang.header.sitename} </h1><userinfo role="admin"></userinfo></div></div>', '', 'class="{opts.for}"', function(opts) {
  var _this = this;
  _this.alert = {};
  _this.on('mount', function(){
    document.body.setAttribute('class', opts.for);
  });

  _this.app.off('alert').on('alert', function(msg, type){

    _this.tags['alert'] &&
    _this.tags['alert'].emit('message', msg, type);
  });

});
