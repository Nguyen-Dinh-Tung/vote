import { ROUTER } from '../../../contants/router/route';

export class Handle {
  static data;
  static setData;
  static navigate;

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
    console.log(Handle.data);
  }
  static handleCancel() {
    const url = window.location.pathname.split('-')[1];
    Handle.navigate(`/${url}`);
  }
}
