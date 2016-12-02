
/**
 * base64数据流上传
 */
<upload-base64>

  <div class="progress" each={progressList}>
    <div class="determinate" ref={name} style="width: {progress||0}%"></div>
  </div>

  <input type="file" name={opts.type} ref="fileInput" multiple>
  <button class="btn" onclick={fn.upload}>上传</button>

  <script>
  this.on('mount', () => {
    this.uploadFiles = [];
  });

  this.fn = {
    upload: (e) => {
      this.uploadFiles = this.refs.fileInput.files;
      this.progressList = [];
      for(let f of this.uploadFiles){
        let fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
          this.emit('base64::loaded', {
            base64: e.target.result,
            name: f.name
          });
        }, { once: true });
        fileReader.readAsDataURL(f);
      }
    }
  };

  this.on('base64::loaded', (data) => {
    this.progressList.push({
      name: data.name,
      progress: 0
    });
    this.app.xhr('//192.168.1.161/upload.php', {
      data: { file: data.base64 },
      method: 'POST'
    }).complete(() => {
      this.app.log(`file ${data.name} completed.`);
    }).progress(per => {
      for(let progress of this.progressList){
        if(progress.name == data.name){
          progress.progress = per;
          this.update();
        }
      }
    });
  });
  </script>

</upload-base64>


/**
 * iframe模式上传
 */
<upload-iframe></upload-iframe>


/**
 * 数字按钮组件
 */
<pagination-number>
  <ul class="pagination">
    <li show={hasPrevPage}>
      <a href="javascript:;" onclick={fn.jumpPage}>1</a>
    </li>
    <li show={hasPrevPage}>
      <a href="javascript:;" onclick={fn.prevPage}>
        &lt;
      </a>
    </li>
    <li show={hasPrevSpan}>...</li>
    <li each={p in prevPages}>
      <a href="javascript:;" onclick={fn.jumpPage}>{p}</a>
    </li>
    <li class="active">
      <a href="javascript:;">{page}</a>
    </li>
    <li each={p in nextPages}>
      <a href="javascript:;" onclick={fn.jumpPage}>{p}</a>
    </li>
    <li show={hasNextSpan}>...</li>
    <li show={hasNextPage}>
      <a href="javascript:;" onclick={fn.nextPage}>
        &gt;
      </a>
    </li>
    <li show={hasNextPage}>
      <a href="javascript:;" onclick={fn.jumpPage}>{pages}</a>
    </li>
  </ul>
  <script>
  this.pageSpan = 4;
  this.fn = {
    prevPages: () => {
      let i = this.pageSpan;
      this.hasPrevSpan = (this.page - this.pageSpan) > 0;
      this.prevPages = [];
      while(i--){
        if(this.page - i > 1 && i > 0){
          this.prevPages.push(this.page - i);
        }
      }
      this.update();
    },
    nextPages: () => {
      let i = 0
      this.hasNextSpan = (this.page + this.pageSpan) < this.pages;
      this.nextPages = [];
      while(++i < this.pageSpan){
        if(this.page + i < this.pages){
          this.nextPages.push(this.page + i);
        }
      }
      this.update();
    },
    // 跳转页
    jumpPage: (e) => {
      this.fn.page(Number(e.item ? e.item.p : e.target.innerText));
    },
    // 上一页
    prevPage: () => {
      if(this.hasPrevPage)
      this.fn.page(this.page - 1);
    },
    // 下一页
    nextPage: () => {
      if(this.hasNextPage)
      this.fn.page(this.page + 1);
    },
    // 切换页面
    page: (n) => {
      this.page = n;
      this.hasNextPage = this.pages > this.page;
      this.hasPrevPage = this.page > 1;
      this.fn.prevPages();
      this.fn.nextPages();
      this.emit('page', n);
    }
  };

  this.on('mount', () => {
    this.page = Number(opts.page);
    this.pages = Number(opts.pages);
    this.fn.page(this.page);
    this.update();
  });
  </script>
</pagination-number>




/**
 * 下拉框分页组件
 */
<pagination-select>
  <dl>
    <dd>
      <a href="javascript:;" class="{'disabled': !hasPrevPage}" onclick={fn.prevPage}>
        上页
      </a>
    </dd>
    <dd>
      <select onchange={fn.jumpPage} value={page}>
        <option each={p in pageList} value="{p}">{p}</option>
      </select>
    </dd>
    <dd>
      <a href="javascript:;" class="{'disabled': !hasNextPage}" onclick={fn.nextPage}>
        下页
      </a>
    </dd>
  </dl>
  <script>

  this.fn = {
    // 循环总页数生成option选项
    pageList: () => {
      this.pageList = [];
      for(let page = 1; page <= this.pages; page++){
        this.pageList.push(page);
      }
    },
    // 跳转页
    jumpPage: (e) => {
      this.fn.page(Number(e.target.value));
    },
    // 上一页
    prevPage: () => {
      if(this.hasPrevPage)
      this.fn.page(this.page - 1);
    },
    // 下一页
    nextPage: () => {
      if(this.hasNextPage)
      this.fn.page(this.page + 1);
    },
    // 切换页面
    page: (n) => {
      this.page = n;
      this.hasNextPage = this.pages > this.page;
      this.hasPrevPage = this.page > 1;
      this.emit('page', n);
    }
  };

  this.on('mount', () => {
    this.page = Number(opts.page);
    this.pages = Number(opts.pages);
    this.fn.pageList();
    this.fn.page(this.page);
    this.update();
  });
  </script>
</pagination-select>
