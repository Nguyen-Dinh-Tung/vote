import { ApiBase } from '../../../api/api.base';
import { FIELD_NOT_HOLLOW } from '../../../contants/notify/notify.register';
import { TRUE } from '../../../contants/notify/status.notify';
import { ERROR, SUCCESS, WARNING } from '../../../contants/notify/type.notify';
import { ROUTER } from '../../../contants/router/route';
const keysNotSent = ['m1', 'm2', 'm3', 'url'];
export class Handle {
  static data;
  static setData;
  static navigate;
  static notifyFunc;
  static handleChange(e) {
    if (e.target.name !== 'background')
      Handle.setData({ ...Handle.data, [e.target.name]: e.target.value });
    else {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      Handle.setData({
        ...Handle.data,
        [e.target.name]: file,
        ['url']: objectUrl,
      });
    }
  }
  static handleSubmit() {
    let flag = true;
    for (let e of Object.values(Handle.data)) {
      if (e === '' || e === undefined) {
        flag = false;
        break;
      }
    }
    if (!flag) Handle.notifyFunc(WARNING, FIELD_NOT_HOLLOW, TRUE);
    const measure = `${Handle.data.m1}-${Handle.data.m2}-${Handle.data.m3}`;
    Handle.data['measure'] = measure;
    const data = new FormData();
    for (let e of Object.keys(Handle.data)) {
      console.log(Handle.data[e]);
      if (!keysNotSent.includes(e)) data.append(e, Handle.data[e]);
    }
    ApiBase.post(ROUTER.CANDIDATE, data)
      .then((res) => {
        if (res.status === 201) {
          Handle.notifyFunc(SUCCESS, res.data.message, TRUE);
          Handle.navigate(ROUTER.CANDIDATE);
        }
      })
      .catch((e) => {
        if (e) Handle.notifyFunc(ERROR, e.response.data.message);
      });
  }
  static handleCancel() {
    const url = window.location.pathname.split('-')[1];
    Handle.navigate(`/${url}`);
  }
}
