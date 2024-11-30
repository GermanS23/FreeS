class Page {
  constructor(result, page, size) {
    this.items = result.rows ? result.rows.map((item) => item) : [];
    this.totalItems = result.count;
    this.page = page;
    this.size = size;
    this.totalPages = result.count ? Math.ceil(result.count / size) : 0;
  }
}

export default Page;