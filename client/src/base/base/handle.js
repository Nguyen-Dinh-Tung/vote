import { TITLE_HEADER } from '../../contants/field.desc';
import { ROUTER } from '../../contants/router/route';
import { setTitle } from '../../redux/features/title-side-bar.slice';

export class Handle {
  static dispatch;
  static noneDefaultEvent(e) {
    e.preventDefault();
  }
  static onLoad(title) {
    Handle.dispatch(setTitle(title));
  }
}
