import axios from 'axios';

export const host = process.env.REACT_APP_HOST_BACK_END;

export class ApiBase {
  static async get(url) {
    let token = localStorage.getItem('token');
    return await axios.get(host + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  static async post(url, data) {
    let token = localStorage.getItem('token');
    return await axios.post(host + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  static async patch(url, data) {
    let token = localStorage.getItem('token');
    return await axios.patch(host + url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
