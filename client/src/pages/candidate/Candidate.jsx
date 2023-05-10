import React, { useEffect, useState } from 'react';
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

function Candidate(props) {
  const [data, setData] = useState();
  const [notifyFunc] = useNotifyFunc();
  useEffect(() => {
    Handle.setData = setData;
  }, []);
  useEffect(() => {
    ApiBase.get(ROUTER.CANDIDATE)
      .then((res) => {
        console.log(res);
        setData(res.data.data);
      })
      .catch((e) => {
        if (e) notifyFunc(ERROR, e.response.data.message, TRUE);
      });
  }, []);
  return (
    <div id="content">
      <div className="controller">
        <BaseButton content={BTN_ADD_CANDIDATE} />
        <BaseInput />
        <BaseSelect />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="table-header">he;;as;da;sda;sd</th>
            <th className="table-header">he;;as;da;sda;sd</th>
            <th className="table-header">he;;as;da;sda;sd</th>
            <th className="table-header">he;;as;da;sda;sd</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
}

export default Candidate;
