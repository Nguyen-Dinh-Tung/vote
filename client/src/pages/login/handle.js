import { ApiBase } from '../../api/api.base';
import { WARNING } from '../../contants/notify/type.notify';
import { TRUE } from '../../contants/notify/status.notify';
import { FIELD_NOT_HOLLOW } from '../../contants/notify/notify.register';
import { DESC_FIELD_CHANGE_PASSWORD } from '../../contants/field.desc';

export class Handle {
  static navigate;
  static infoLogin;
  static setInfoLogin;
  static notifyFunc;
  static urlLogin = `/auth/login`;
  static showRegister() {
    Handle.navigate('/register');
  }
  static handleChange(e) {
    Handle.setInfoLogin({
      ...Handle.infoLogin,
      [e.target.name]: e.target.value,
    });
  }
  static handleEnter(e) {
    if (e.key === 'Enter') Handle.handleLogin();
  }
  static handleLogin() {
    let flag = true;
    if (!Handle.infoLogin) {
      Handle.notifyFunc(WARNING, FIELD_NOT_HOLLOW, TRUE);
      return;
    }
    Object.values(Handle.infoLogin).some((val) => {
      if (val == '') {
        flag = false;
      }
    });

    if (!flag) {
      Handle.notifyFunc(WARNING, FIELD_NOT_HOLLOW, TRUE);
    }

    ApiBase.post(Handle.urlLogin, Handle.infoLogin)
      .then((res) => {
        if (res.status == 200) {
          let token = res.data.token;
          localStorage.setItem('token', token);
          Handle.navigate('/');
        }
      })
      .catch((e) => {
        if (e) {
          Handle.notifyFunc(WARNING, e.response.data.message, TRUE);
        }
      });
  }
  static showForgotPassword = () => {
    Handle.navigate('/auth/forgot-password');
  };
}
