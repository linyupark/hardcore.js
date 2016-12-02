

/**
 * 数字按钮组件
 */
<pagination-number>
  <dl>
    <dd show={hasPrevPage}>
      <a href="javascript:;" onclick={fn.jumpPage}>1</a>
    </dd>
    <dd show={hasPrevPage}>
      <a href="javascript:;" onclick={fn.prevPage}>
        &lt;
      </a>
    </dd>
    <dd show={hasPrevSpan}>...</dd>
    <dd each={p in prevPages}>
      <a href="javascript:;" onclick={fn.jumpPage}>{p}</a>
    </dd>
    <dd>
      <span>{page}</span>
    </dd>
    <dd each={p in nextPages}>
      <a href="javascript:;" onclick={fn.jumpPage}>{p}</a>
    </dd>
    <dd show={hasNextSpan}>...</dd>
    <dd show={hasNextPage}>
      <a href="javascript:;" onclick={fn.nextPage}>
        &gt;
      </a>
    </dd>
    <dd show={hasNextPage}>
      <a href="javascript:;" onclick={fn.jumpPage}>{pages}</a>
    </dd>
  </dl>
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
