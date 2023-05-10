import { ROUTER } from '../../contants/router/route';

export class Handle {
  static navigate;
  static setTarget;
  static showCandidate(e) {
    Handle.navigate(ROUTER.CANDIDATE);
    Handle.setTarget('1');
  }
  static showCompany() {
    Handle.navigate(ROUTER.COMPANY);
    Handle.setTarget('3');
  }
  static showContest() {
    Handle.navigate(ROUTER.CONTEST);
    Handle.setTarget('2');
  }
}
