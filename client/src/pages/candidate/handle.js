export class Handle {
  static setData;
  static meta;
  static setMeta;
  static navigate;
  static handlePagination(e, page) {
    Handle.setMeta({ ...Handle.meta, ['page']: page });
  }
  static handleChangeFilter(e) {
    if (e.target.value !== 'Trạng thái')
      Handle.setMeta({ ...Handle.meta, ['isActive']: e.target.value });
  }
  static handleChangeSearch(e) {
    Handle.setMeta({ ...Handle.meta, ['search']: e.target.value });
  }
  static handleSubmit() {}
}
