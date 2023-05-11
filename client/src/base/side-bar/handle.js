import { TITLE_HEADER } from '../../contants/field.desc';
import { ROUTER } from '../../contants/router/route';
import { setOpen } from '../../redux/features/lazyload.slice';
import { setTitle } from '../../redux/features/title-side-bar.slice';

export class Handle {
  static navigate;
  static setTarget;
  static dispatch;
  static showCandidate(e) {
    Handle.checkAndOpenLazyload(ROUTER.CANDIDATE);
    Handle.navigate(ROUTER.CANDIDATE);
    Handle.setTarget('1');
  }
  static showCompany() {
    Handle.checkAndOpenLazyload(ROUTER.COMPANY);
    Handle.navigate(ROUTER.COMPANY);
    Handle.setTarget('3');
    Handle.setTitleHeader(TITLE_HEADER.CONTEST.VIEW);
  }
  static showContest() {
    Handle.navigate(ROUTER.CONTEST);
    Handle.checkAndOpenLazyload(ROUTER.CONTEST);
    Handle.setTarget('2');
    Handle.setTitleHeader(TITLE_HEADER.COMPANY.VIEW);
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
