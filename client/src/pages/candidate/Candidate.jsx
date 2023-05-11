import React, { useEffect, useRef, useState } from 'react';
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
import { checkedStyle, inputSearch, styleIconSetting } from './style';
import { baseBtnAdd } from '../../base/base/style';
import Paginations from '../../components/pagination/Pagination';
import { Avatar } from '@mui/material';
import { STATUS } from '../../contants/field.desc';
import { useDispatch } from 'react-redux';
import { setOpen } from '../../redux/features/lazyload.slice';
import SettingsIcon from '@mui/icons-material/Settings';
function Candidate(props) {
  const [data, setData] = useState();
  const [notifyFunc] = useNotifyFunc();
  const [meta, setMeta] = useState();
  const [checked, setChecked] = useState([]);
  const navigate = useNavigate();
  const refSearch = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    Handle.setData = setData;
    Handle.setMeta = setMeta;
    Handle.navigate = navigate;
    Handle.dispatch = dispatch;
    Handle.setChecked = setChecked;
  }, []);
  useEffect(() => {
    Handle.checked = checked;
  }, [checked]);
  useEffect(() => {
    Handle.meta = meta;
  }, [meta]);
  useEffect(() => {
    Handle.refSearch = refSearch;
  }, [refSearch]);
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
        dispatch(setOpen(false));
        setData({
          data: res.data.data,
          totalPage: res.data.meta.totalPage,
        });
      })
      .catch((e) => {
        if (e) {
          notifyFunc(ERROR, e.response.data.message, TRUE);
          dispatch(setOpen(false));
        }
      });
  }, [meta]);
  return (
    <div
      id="content"
      onLoad={() => {
        console.log('fack');
      }}
    >
      <div id="controller">
        <BaseButton
          customCss={baseBtnAdd}
          content={BTN_ADD_CANDIDATE}
          handleClick={Handle.handleShowCreateCandidate}
        />
        <BaseInput
          placeholder={'Nhập tên hoặc email thí sinh'}
          customCss={inputSearch}
          handleChange={Handle.handleChangeSearch}
          ref={refSearch}
        />
        <BaseSelect options={STATUS} handleChange={Handle.handleChangeFilter} />
      </div>
      <div className="container-table">
        <table className="table">
          <thead>
            <tr>
              <th className="table-header first-element-w">Số báo danh</th>
              <th className="table-header">Họ và tên</th>
              <th className="table-header">Địa chỉ</th>
              <th className="table-header">Email</th>
              <th className="table-header text-center">Ảnh</th>
              <th className="table-header">check</th>
              <th className="table-header text-center">Tùy chỉnh</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data['data'].map((e, index) => {
                return (
                  <tr key={e && e.id} className="tr-body">
                    <td
                      className="td-body first-element-w text-center"
                      style={{
                        backgroundColor: checked.includes(e.id)
                          ? checkedStyle
                          : '',
                      }}
                      onClick={() => {
                        Handle.handleChecked(e && e.id);
                      }}
                    >
                      {e && e.idno}
                    </td>
                    <td
                      className="td-body"
                      onClick={() => {
                        Handle.handleChecked(e && e.id);
                      }}
                    >
                      {e && e.name}
                    </td>
                    <td
                      className="td-body"
                      onClick={() => {
                        Handle.handleChecked(e && e.id);
                      }}
                    >
                      {e && e.address}
                    </td>
                    <td
                      className="td-body"
                      onClick={() => {
                        Handle.handleChecked(e && e.id);
                      }}
                    >
                      {e && e.email}
                    </td>
                    <td
                      className="td-body text-center"
                      onClick={() => {
                        Handle.handleChecked(e && e.id);
                      }}
                    >
                      <Avatar src={process.env.REACT_APP_HOST + e.background} />
                    </td>
                    <td
                      className="td-body"
                      onClick={() => {
                        Handle.handleChecked(e && e.id);
                      }}
                    >
                      {e && e.measure}
                    </td>
                    <td className="td-body text-center">
                      <SettingsIcon
                        sx={styleIconSetting}
                        onClick={() => {
                          Handle.showSetting(e.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div id="pagination">
        <Paginations
          handleChange={Handle.handlePagination}
          totalPage={data && data['totalPage']}
        />
      </div>
    </div>
  );
}

export default Candidate;
