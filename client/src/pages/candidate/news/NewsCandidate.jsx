import React from 'react';
import { FIELD_CREATE } from '../../../contants/field.desc';
import BaseFileButton from '../../../components/file-button/BaseFileButton';
import { baseFileButton } from '../style';
import { baseBtnAdd, baseBtnCancel } from '../../../base/base/style';
import { BTN_ADD_CANDIDATE, BTN_CANCEL } from '../../../contants/btn';
import BaseButton from '../../../components/btn/BaseButton';

function NewsCandidate(props) {
  return (
    <div id="content" className="flex">
      <div id="bg-form" className="width-40"></div>
      <div id="form" className="width-60">
        <p className="header-form">Nhập thông tin thí sinh</p>
        <div className="form-control">
          <div className="box-input margin-r-10">
            <label className="lable" htmlFor="sbd">
              Số báo danh :
            </label>
            <input
              id="sbd"
              type="text"
              name="idno"
              className="base-input-form"
              placeholder="Nhập số báo danh"
            />
          </div>
          <div className="box-input">
            <label className="lable" htmlFor={FIELD_CREATE.NAME}>
              Họ và tên :
            </label>
            <input
              id={FIELD_CREATE.NAME}
              type="text"
              name="name"
              className="base-input-form"
              placeholder="Nhập họ và tên"
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
              type="text"
              name="email"
              className="base-input-form"
              placeholder="Nhập email"
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
            />
          </div>
        </div>
        <div className="form-control">
          <div className="box-input margin-r-10">
            <label className="lable" htmlFor="measure">
              Số đo ba vòng
            </label>
            <input
              id="measure"
              type="text"
              name="measure"
              className="base-input-form"
              placeholder="Nhập số đo ba vòng"
            />
          </div>
        </div>
        <div className="form-control">
          <BaseFileButton customCss={baseFileButton}></BaseFileButton>
        </div>

        <div className="form-control">
          <BaseButton customCss={baseBtnAdd} content={BTN_ADD_CANDIDATE} />
          <BaseButton customCss={baseBtnCancel} content={BTN_CANCEL} />
        </div>
      </div>
    </div>
  );
}

export default NewsCandidate;
