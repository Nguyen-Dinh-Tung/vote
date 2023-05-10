import * as React from 'react';
import './index.css';
import BaseButton from '../../components/btn/BaseButton';
import {
  BTN_CANCEL,
  BTN_CHANGE_PASSWORD,
  BTN_GET_TOKEN,
} from '../../contants/btn';
import BaseInput from '../../components/base-input/BaseInput';
import {
  DESC_FIELD_CHANGE_PASSWORD,
  placeholderForGotPassword,
} from '../../contants/field.desc';
import { style_btn_success } from '../../style/base.style';
import useNotifyFunc from '../../hooks/notify.func';
import AlertComponents from '../../components/alert/Alert';
import { useNavigate } from 'react-router';
import Footer from '../../base/footer/Footer';
import { Handle } from './handle';
const styleInput = {
  borderRadius: '6px',
  border: 'solid 1px #ccc',
  height: '46px',
  paddingLeft: '16px',
};

export default function ForgotPassword(props) {
  const [notifyFunc] = useNotifyFunc();
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({
    code: '',
    password: '',
    rePassword: '',
    username: '',
  });
  const navigate = useNavigate();
  React.useEffect(() => {
    Handle.data = data;
  }, [data]);
  React.useEffect(() => {
    Handle.setData = setData;
    Handle.setStep = setStep;
    Handle.notifyFunc = notifyFunc;
    Handle.navigate = navigate;
  }, []);
  return (
    <div className="auth-forgot-password">
      <div className="container-forgot-password">
        <p className="title-forgot-password">Lấy lại mật khẩu của bạn</p>
        <hr />
        <p className="desc-forgot-password">
          Vui lòng nhập tên đăng nhập của bạn
        </p>
        <BaseInput
          placeholder={placeholderForGotPassword}
          customCss={styleInput}
          handleChange={Handle.handleChangeInput}
          name={DESC_FIELD_CHANGE_PASSWORD.username}
        ></BaseInput>
        <div className="group-btn-forgot-password">
          {step === 1 ? (
            <BaseButton
              handleClick={Handle.handleSubmitGetToken}
              content={BTN_GET_TOKEN}
              customCss={style_btn_success}
            />
          ) : (
            ''
          )}
          <BaseButton handleClick={Handle.showLogin} content={BTN_CANCEL} />
        </div>

        <hr />
      </div>
      <div className="content-bottom-forgot-password">
        {step === 2 ? (
          <div className="container-change-password">
            <BaseInput
              placeholder={'Nhập mã Otp'}
              customCss={{ ...styleInput }}
              handleChange={Handle.handleChangeInput}
              name={DESC_FIELD_CHANGE_PASSWORD.code}
            ></BaseInput>
            <div className="header-bottom-forgot-password">
              <p className="desc-forgot-password">Nhập mật khẩu mới</p>
            </div>
            <BaseInput
              placeholder={placeholderForGotPassword}
              customCss={styleInput}
              handleChange={Handle.handleChangeInput}
              name={DESC_FIELD_CHANGE_PASSWORD.password}
              type={DESC_FIELD_CHANGE_PASSWORD.password}
            ></BaseInput>
            <div className="mt-16">
              <BaseInput
                placeholder={placeholderForGotPassword}
                customCss={styleInput}
                handleChange={Handle.handleChangeInput}
                name={DESC_FIELD_CHANGE_PASSWORD.rePassword}
                type={DESC_FIELD_CHANGE_PASSWORD.password}
              ></BaseInput>
            </div>
            <div className="element-center mt-16">
              <BaseButton
                handleClick={Handle.handleSubmitChangePassword}
                content={BTN_CHANGE_PASSWORD}
                customCss={style_btn_success}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <Footer />
      <AlertComponents />
    </div>
  );
}
