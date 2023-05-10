import { ApiBase } from '../../api/api.base';
import { DESC_FIELD_CHANGE_PASSWORD } from '../../contants/field.desc';
import {
  FIELD_NOT_HOWLOW,
  USERNAME_NOT_FOUNT,
} from '../../contants/notify/message';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR, SUCCESS } from '../../contants/notify/type.notify';

export class Handle {
  static data;
  static setData;
  static setStep;
  static notifyFunc;
  static navigate;
  static urlTokenEmail = '/auth/token-email';
  static urlChangePassword = '/auth/password';
  static urlLogin = '/auth/login';
  static handleChangeInput(e) {
    if (e.target.name === DESC_FIELD_CHANGE_PASSWORD.username) {
      Handle.setData({ ...Handle.data, [e.target.name]: e.target.value });
      Handle.setStep(1);
    }
    Handle.setData({ ...Handle.data, [e.target.name]: e.target.value });
  }

  static handleSubmitGetToken() {
    if (Handle.data.username !== '')
      ApiBase.post(Handle.urlTokenEmail, { username: Handle.data.username })
        .then((res) => {
          if (res.status === 200) {
            Handle.notifyFunc(SUCCESS, res.data.message, TRUE);
            Handle.setStep(2);
          }
        })
        .catch((e) => {
          if (e) {
            Handle.notifyFunc(ERROR, e.response.data.message, TRUE);
          }
        });
    else Handle.notifyFunc(ERROR, USERNAME_NOT_FOUNT, TRUE);
  }
  static showLogin() {
    Handle.navigate('/auth/login');
  }
  static handleSubmitChangePassword() {
    let flag = true;
    for (let e of Object.values(Handle.data)) {
      if (e === '') flag = false;
    }
    if (flag === false) Handle.notifyFunc(ERROR, FIELD_NOT_HOWLOW, TRUE);
    ApiBase.post(Handle.urlChangePassword, Handle.data)
      .then((res) => {
        if (res.status === 200) {
          Handle.notifyFunc(SUCCESS, res.data.message, TRUE);
          Handle.navigate(Handle.urlLogin);
        }
      })
      .catch((e) => {
        if (e) Handle.notifyFunc(ERROR, e.response.data.message, TRUE);
      });
  }
}
