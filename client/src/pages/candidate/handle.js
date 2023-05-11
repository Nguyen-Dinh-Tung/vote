import { TITLE_HEADER } from '../../contants/field.desc';
import { setTitle } from '../../redux/features/title-side-bar.slice';
import { Handle as handleSideBar } from '../../base/side-bar/handle';
export class Handle {
  static setData;
  static meta;
  static setMeta;
  static navigate;
  static refSearch;
  static setChecked;
  static checked;
  static dispatch;
  static handlePagination(e, page) {
    Handle.setMeta({ ...Handle.meta, ['page']: page });
  }
  static handleChangeFilter(e) {
    handleSideBar.lazyload();
    if (e.target.value !== 'Trạng thái')
      Handle.setMeta({ ...Handle.meta, ['isActive']: e.target.value });
  }
  static handleChangeSearch(e) {
    let value = e.target.value;
    if (Handle.refSearch.current) clearTimeout(Handle.refSearch.current);
    Handle.refSearch.current = setTimeout(() => {
      if (value !== '') {
        Handle.setMeta({ ...Handle.meta, ['search']: value, ['page']: 1 });
      } else {
        Handle.setMeta({ ...Handle.meta, ['search']: '' });
      }
    }, 1000);
  }
  static handleChecked(id) {
    if (Handle.checked.includes(id)) {
      Handle.checked.splice(Handle.checked.indexOf(id), 1);
      Handle.setChecked([...Handle.checked]);
    } else {
      Handle.checked.push(id);
      Handle.setChecked([...Handle.checked]);
    }
  }
  static showSetting(id) {
    Handle.navigate(`/candidate/${id}`);
    handleSideBar.setTitleHeader(TITLE_HEADER.CANDIDATE.UPDATE);
  }
  static handleShowCreateCandidate() {
    Handle.navigate('/new-candidate');
    handleSideBar.setTitleHeader(TITLE_HEADER.CANDIDATE.CREATE);
  }
}
