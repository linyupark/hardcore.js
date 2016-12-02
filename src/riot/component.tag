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
  /**
   * 带下拉框的分页组件
   * 效果: 上页[1]下页
   */
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
    console.log(1);
    this.page = Number(opts.page);
    this.pages = Number(opts.pages);
    this.fn.pageList();
    this.fn.page(this.page);
    this.update();
  });
  </script>
</pagination-select>
