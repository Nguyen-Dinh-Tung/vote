import { TITLE_HEADER } from '../../contants/field.desc';
import { ROUTER } from '../../contants/router/route';
import { setOpen } from '../../redux/features/lazyload.slice';
import { setTitle } from '../../redux/features/title-side-bar.slice';

export class Handle {
  static navigate;
  static setTarget;
  static dispatch;
  static showUsers(e) {
    Handle.checkAndOpenLazyload(ROUTER.CANDIDATE);
    Handle.navigate(ROUTER.USER);
    Handle.setTarget('1');
  }
  static showCandidate(e) {
    Handle.checkAndOpenLazyload(ROUTER.CANDIDATE);
    Handle.navigate(ROUTER.CANDIDATE);
    Handle.setTarget('2');
  }
  static showContest() {
    Handle.navigate(ROUTER.CONTEST);
    Handle.checkAndOpenLazyload(ROUTER.CONTEST);
    Handle.setTarget('3');
  }
  static showCompany() {
    Handle.checkAndOpenLazyload(ROUTER.COMPANY);
    Handle.navigate(ROUTER.COMPANY);
    Handle.setTarget('4');
  }
  static showReport() {
    Handle.checkAndOpenLazyload(ROUTER.COMPANY);
    Handle.navigate(ROUTER.REPORT);
    Handle.setTarget('5');
  }
  static lazyload() {
    Handle.dispatch(setOpen(true));
  }
  static setTitleHeader(data) {
    Handle.dispatch(setTitle(data));
  }
  static checkAndOpenLazyload(path) {
    const url = window.location.pathname;
    if (url !== path) Handle.lazyload();
  }
}
