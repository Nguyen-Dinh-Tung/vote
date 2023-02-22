import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './index.css'
import { DESIGN, FB_INFO, LOGO, PHONE_NUMBER, PREFACE, SLOGAN, THANKS } from './intro';
import BtnOutLine from '../../components/button/BtnOutLine'
import { BTN_FOR_GOT_PASS, BTN_SUBMIT, BTN_TO_LOGIN } from '../../contants/btn';
import AlertComponents from '../../components/alert/Alert';
import useNotifyFunc from '../../hooks/notify.func';
import { WARNING } from '../../contants/notify/type.notify';
import { TRUE } from '../../contants/notify/status.notify';
import { FIELD_NOT_HOLLOW } from '../../contants/notify/notify.register';
import { ApiBase } from '../../api/api.base';
const InfoLogin = [
    ['username' , 'text' ,'Tên đăng nhập'] ,            
    ['password' , 'password' , 'Mật khẩu'] 
]
function Login(props) {
    let location = useLocation() ;
    const navigate = useNavigate() ;
    const [infoLogin , setInfoLogin] = useState() ;
    const [notifyFunc] = useNotifyFunc()
    const urlLogin = `/auth/login`
    let cssButton = {
        width : '100%',
        fontSize : '18px',
        fontWeight : '500'
    }
    const showRegister = () =>{
        navigate('/register')
    }

    const showFacebook = () =>{
        window.open('https://www.facebook.com/pharrealjun/')
    }

    const handleChange = (e) =>{
        setInfoLogin({...infoLogin , [e.target.name] : e.target.value})
    }

    const handleLogin = ()=>{
        let flag = true
        if(!infoLogin){
            notifyFunc(
                WARNING ,
                FIELD_NOT_HOLLOW,
                TRUE ,
            )
            return
        }
        Object.values(infoLogin).some(val =>{
            if(val == ''){
                flag = false
            }
        })

        if(!flag){
            notifyFunc(WARNING ,
                FIELD_NOT_HOLLOW,
                TRUE ,)
        }

        ApiBase.post(urlLogin , infoLogin)
        .then(res =>{
            console.log(res);
            if(res.status == 200){
                let token = res.data.token ;
                localStorage.setItem('token' , token)
                navigate('/')
            }

        })
        .catch(e =>{
            console.log(e);
            if(e) {
                notifyFunc(
                    WARNING ,
                    e.response.data.message,
                    TRUE ,
                )
            }

        })

    }

    return (
        <div className='container'>
            <div className="content-login">
            <div className="introduc">
                <div className="logo">{LOGO}</div>
                <div className="intro">{PREFACE}</div>
                <div className="intro">{SLOGAN}</div>
                <div className="intro">{THANKS}</div>
            </div>
            <div className="form">
                <form className="form-login">
                    {InfoLogin && InfoLogin.map((e , index)=>{
                        return <input className="input-field" onChange={handleChange} type={e[1]} name={e[0]} placeholder={e[2]}/>
                    })}
                </form>
                <div className="btn-submit" onClick={handleLogin}>
                    <BtnOutLine desc={BTN_TO_LOGIN} css={cssButton}/>
                </div>
                <div className="line">
                <div className="hr"></div>
                </div>
                <div className="forgot-password">
                    <p>{BTN_FOR_GOT_PASS}</p>
                </div>
                <div className="btn-register" >
                <button   
                    className='button'
                    xs={{backgroundColor : '#00acc1'}}
                    onClick={showRegister}
                    >{BTN_SUBMIT}
                </button>
                </div>
            </div>
            </div>
            <div className="footer">
                <div className="footer-info border-option">
                    <p onClick={showFacebook}>{FB_INFO}</p>
                    <span className='border-right'></span>
                </div>
                <div className="footer-info border-option">
                    <p>{PHONE_NUMBER}</p>
                    <span className='border-right '></span>
                </div>
                <div className="footer-info border-option">
                    <p>{DESIGN}</p>
                </div>
            </div>
            <AlertComponents/>
        </div>
    );
}

export default Login;