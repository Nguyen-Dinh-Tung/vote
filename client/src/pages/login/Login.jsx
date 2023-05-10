import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './index.css';
import { LOGO, PREFACE, SLOGAN, THANKS } from './intro';
import BtnOutLine from '../../components/button/BtnOutLine';
import { BTN_FOR_GOT_PASS, BTN_SUBMIT, BTN_TO_LOGIN } from '../../contants/btn';
import AlertComponents from '../../components/alert/Alert';
import useNotifyFunc from '../../hooks/notify.func';
import Footer from '../../base/footer/Footer';
import { Handle } from './handle';
const InfoLogin = [
  ['username', 'text', 'Tên đăng nhập'],
  ['password', 'password', 'Mật khẩu'],
];
const cssButton = {
  width: '100%',
  fontSize: '18px',
  fontWeight: '500',
};
function Login(props) {
  const navigate = useNavigate();
  const [infoLogin, setInfoLogin] = useState();
  const [notifyFunc] = useNotifyFunc();
  useEffect(() => {
    Handle.navigate = navigate;
    Handle.setInfoLogin = setInfoLogin;
    Handle.notifyFunc = notifyFunc;
  }, []);
  useEffect(() => {
    Handle.infoLogin = infoLogin;
  }, [infoLogin]);

  return (
    <div className="container">
      <div className="content-login">
        <div className="introduc">
          <div className="logo">{LOGO}</div>
          <div className="intro">{PREFACE}</div>
          <div className="intro">{SLOGAN}</div>
          <div className="intro">{THANKS}</div>
        </div>
        <div className="form">
          <form className="form-login">
            {InfoLogin &&
              InfoLogin.map((e, index) => {
                return (
                  <input
                    className="input-field"
                    onChange={Handle.handleChange}
                    type={e[1]}
                    name={e[0]}
                    placeholder={e[2]}
                    onKeyUp={Handle.handleEnter}
                  />
                );
              })}
          </form>
          <div className="btn-submit" onClick={Handle.handleLogin}>
            <BtnOutLine desc={BTN_TO_LOGIN} css={cssButton} />
          </div>
          <div className="line">
            <div className="hr"></div>
          </div>
          <div className="forgot-password">
            <p onClick={Handle.showForgotPassword}>{BTN_FOR_GOT_PASS}</p>
          </div>
          <div className="btn-register">
            <button
              className="button"
              xs={{ backgroundColor: '#00acc1' }}
              onClick={Handle.showRegister}
            >
              {BTN_SUBMIT}
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <AlertComponents />
    </div>
  );
}

export default Login;
