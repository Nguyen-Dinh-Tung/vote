import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Handle } from './handle';
import { ApiBase } from '../../api/api.base';
import { ROUTER } from '../../contants/router/route';
import useNotifyFunc from '../../hooks/notify.func';
import { ERROR } from '../../contants/notify/type.notify';
import { TRUE } from '../../contants/notify/status.notify';
import BaseButton from '../../components/btn/BaseButton';
import { BTN_ADD_CANDIDATE } from '../../contants/btn';
import BaseInput from '../../components/base-input/BaseInput';
import BaseSelect from '../../components/base-select/BaseSelect';
import { inputSearch } from './style';
import { baseBtnAdd } from '../../base/base/style';
import Paginations from '../../components/pagination/Pagination';
import { Avatar } from '@mui/material';
import { STATUS } from '../../contants/field.desc';

function Candidate(props) {
  const [data, setData] = useState([]);
  const [notifyFunc] = useNotifyFunc();
  const [meta, setMeta] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    Handle.setData = setData;
    Handle.setMeta = setMeta;
    Handle.navigate = navigate;
  }, []);
  useEffect(() => {
    Handle.meta = meta;
  }, [meta]);
  useEffect(() => {
    let getListUrl = `${ROUTER.CANDIDATE}?${
      meta && meta['page'] !== undefined ? 'page=' + meta['page'] : 'page=' + 1
    }`;
    if (meta && meta['isActive'] !== undefined)
      getListUrl += `&isActive=${meta['isActive']}`;
    if (meta && meta['search'] !== undefined)
      getListUrl += `&search=${meta['search']}`;
    ApiBase.get(getListUrl)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((e) => {
        if (e) notifyFunc(ERROR, e.response.data.message, TRUE);
      });
  }, [meta]);
  return (
    <div id="content">
      <div id="controller">
        <BaseButton
          customCss={baseBtnAdd}
          content={BTN_ADD_CANDIDATE}
          handleClick={Handle.handleSubmit}
        />
        <BaseInput
          placeholder={'Nhập tên hoặc email thí sinh'}
          customCss={inputSearch}
          handleChange={Handle.handleChangeSearch}
        />
        <BaseSelect options={STATUS} handleChange={Handle.handleChangeFilter} />
      </div>
      <div className="container-table">
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Số báo danh</th>
              <th className="table-header">Họ tên</th>
              <th className="table-header">Địa chỉ</th>
              <th className="table-header">Email</th>
              <th className="table-header">Ảnh</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((e, index) => {
                return (
                  <tr key={e && e.id} className="tr-body">
                    <td className="td-body">{e && e.idno}</td>
                    <td className="td-body">{e && e.name}</td>
                    <td className="td-body">{e && e.address}</td>
                    <td className="td-body">{e && e.email}</td>
                    <td className="td-body">
                      <Avatar src={process.env.REACT_APP_HOST + e.background} />
                    </td>
                    <td className="td-body">{e && e.measure}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div id="pagination">
        <Paginations handleChange={Handle.handlePagination} />
      </div>
    </div>
  );
}

export default Candidate;
