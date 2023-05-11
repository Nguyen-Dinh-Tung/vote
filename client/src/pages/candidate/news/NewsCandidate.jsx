import React, { useEffect, useState } from 'react';
import { FIELD_CREATE, TITLE_HEADER } from '../../../contants/field.desc';
import BaseFileButton from '../../../components/file-button/BaseFileButton';
import { baseFileButton } from '../style';
import { baseBtnAdd, baseBtnCancel } from '../../../base/base/style';
import { BTN_ADD_CANDIDATE, BTN_CANCEL } from '../../../contants/btn';
import BaseButton from '../../../components/btn/BaseButton';
import { Handle } from './handle';
import { useNavigate } from 'react-router';
import { Handle as handleBase } from '../../../base/base/handle';
function NewsCandidate(props) {
  const [data, setData] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    Handle.setData = setData;
    Handle.navigate = navigate;
  }, []);
  useEffect(() => {
    Handle.data = data;
  }, [data]);
  return (
    <div id="content" className="flex" onLoad={Handle.onLoad}>
      <div
        id="bg-form"
        className="width-40"
        style={{
          backgroundImage:
            data && data['url'] ? `url(${data && data['url']})` : '',
        }}
      ></div>
      <div id="form" className="width-60">
        <form
          onSubmit={(e) => {
            handleBase.noneDefaultEvent(e);
          }}
          onChange={Handle.handleChange}
        >
          <p className="header-form">Nhập thông tin thí sinh</p>
          <div className="form-control">
            <div className="box-input margin-r-10">
              <label className="lable" htmlFor="sbd">
                Số báo danh
              </label>
              <input
                id="sbd"
                type="text"
                name="idno"
                className="base-input-form"
                placeholder="Nhập số báo danh"
                required
              />
            </div>
            <div className="box-input">
              <label className="lable" htmlFor={FIELD_CREATE.NAME}>
                Họ và tên
              </label>
              <input
                id={FIELD_CREATE.NAME}
                type="text"
                name="name"
                className="base-input-form"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          </div>
          <div className="form-control ">
            <div className="box-input margin-r-10">
              <label className="lable" htmlFor={FIELD_CREATE.EMAIL}>
                Email
              </label>
              <input
                id={FIELD_CREATE.EMAIL}
                type="email"
                name="email"
                className="base-input-form"
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="box-input">
              <label className="lable" htmlFor={FIELD_CREATE.ADDRESS}>
                Quê quán
              </label>
              <input
                id={FIELD_CREATE.ADDRESS}
                name="address"
                type="text"
                className="base-input-form"
                placeholder="Nhập quê quán"
                required
              />
            </div>
          </div>
          <div className="form-control">
            <div className="box-input margin-r-10">
              <label className="lable" htmlFor="height">
                Chiều cao
              </label>
              <input
                id="height"
                type="text"
                name="height"
                className="base-input-form"
                placeholder="Nhập chiều cao"
                required
              />
            </div>
            <div className="box-input">
              <label className="lable" htmlFor="weight">
                Cân nặng
              </label>
              <input
                id="weight"
                type="text"
                name="weight"
                className="base-input-form"
                placeholder="Nhập cân nặng"
                required
              />
            </div>
          </div>
          <div className="form-control">
            <div className="box-input margin-r-10">
              <label className="lable" htmlFor="descs">
                Giới thiệu
              </label>
              <input
                id="descs"
                type="text"
                name="descs"
                className="base-input-form"
                placeholder="Nhập giới thiệu thí sinh"
                required
              />
            </div>
            <div className="box-input">
              <label className="lable" htmlFor="slogan">
                Slogan
              </label>
              <input
                id="slogan"
                type="text"
                name="slogan"
                className="base-input-form"
                placeholder="Nhập slogan"
                required
              />
            </div>
          </div>
          <div className="form-control-3">
            <div className="box-input margin-r-10">
              <label className="lable" htmlFor="m1">
                Vòng một
              </label>
              <input
                id="m1"
                type="number"
                name="m1"
                className="base-input-form"
                placeholder="Nhập vòng một"
                required
              />
            </div>
            <div className="box-input margin-r-10">
              <label className="lable" htmlFor="m2">
                Vòng hai
              </label>
              <input
                id="m2"
                type="number"
                name="m2"
                className="base-input-form"
                placeholder="Nhập vòng hai"
                required
              />
            </div>
            <div className="box-input">
              <label className="lable" htmlFor="m3">
                Vòng ba
              </label>
              <input
                id="m3"
                type="number"
                name="m3"
                className="base-input-form"
                placeholder="Nhập vòng ba"
                required
              />
            </div>
          </div>
          <div className="form-control">
            <BaseFileButton customCss={baseFileButton}></BaseFileButton>
          </div>

          <div className="form-control">
            <BaseButton
              handleClick={Handle.handleSubmit}
              customCss={baseBtnAdd}
              content={BTN_ADD_CANDIDATE}
            />
            <BaseButton
              handleClick={Handle.handleCancel}
              customCss={baseBtnCancel}
              content={BTN_CANCEL}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewsCandidate;
