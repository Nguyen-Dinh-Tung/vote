import { TITLE_HEADER } from '../../contants/field.desc';
import { ROUTER } from '../../contants/router/route';
import { setOpen } from '../../redux/features/lazyload.slice';
import { setTitle } from '../../redux/features/title-side-bar.slice';

export class Handle {
  static navigate;
  static setTarget;
  static dispatch;
  static showCandidate(e) {
    Handle.lazyload();
    Handle.navigate(ROUTER.CANDIDATE);
    Handle.setTarget('1');
    Handle.setTitleHeader(TITLE_HEADER.CANDIDATE.VIEW);
  }
  static showCompany() {
    Handle.lazyload();
    Handle.navigate(ROUTER.COMPANY);
    Handle.setTarget('3');
    Handle.setTitleHeader(TITLE_HEADER.CONTEST.VIEW);
  }
  static showContest() {
    Handle.lazyload();
    Handle.navigate(ROUTER.CONTEST);
    Handle.setTarget('2');
    Handle.setTitleHeader(TITLE_HEADER.COMPANY.VIEW);
  }
  static lazyload() {
    Handle.dispatch(setOpen(true));
  }
  static setTitleHeader(data) {
    Handle.dispatch(setTitle(data));
  }
}
