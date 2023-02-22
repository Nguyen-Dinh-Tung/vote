import React, { useState  } from 'react';
import { useNavigate } from "react-router-dom";

import BtnOutLine from '../../components/button/BtnOutLine';
import { BTN_SUBMIT, BTN_TO_LOGIN } from '../../contants/btn';
import './index.css'
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR } from '../../contants/notify/type.notify';
import { EMAIL_REGEX, FIELD_NOT_HOLLOW, IMG_VALIDATE, PASSWORD_MIN, PASSWORD_REGEX, USER_MIN_LENGTH, USER_REGEX } from '../../contants/notify/notify.register';
import AlertComponents from '../../components/alert/Alert';
import {setAlert} from '../../redux/features/show.slice'
import { regexEmail, regexPassword, regexUsername } from '../../regex/userInfo.regex';
import useNotifyFunc from '../../hooks/notify.func';
import isValidPhoto from '../../validate/img.validate';
import { ApiBase } from '../../api/api.base';
import { LOGO } from '../login/intro';

const infoRegister = [
['username' , 'text' ,'Tên đăng nhập'] ,            
['password' , 'password' , 'Mật khẩu'] ,
['name' , 'text' , 'Họ và tên'] ,
['address' , 'text' , 'Địa chỉ'],
['email' , 'email' , 'Email đăng ký'] ,
['background' , 'file' ,'image/*']
]
function Register(props) {

    const [user , setUser] = useState() ;
    const [avatar , setAvatar] = useState() ;
    const dispatch = useDispatch()
    const [notifyFunc] = useNotifyFunc()
    const urlAddUser = '/auth/register'
    const urlLogin = `/auth/login`
    const navigate = useNavigate()
    console.log(avatar);
    const handleChange = (e) =>{

        console.log(e.target.name);
        if(e.target.name == "background"){
            let file = e.target.files[0] 
            if(file){
                if(!isValidPhoto(file.type)){
                notifyFunc(ERROR , IMG_VALIDATE , TRUE)
                    return
                }
            }
            let ObjectUrl = URL.createObjectURL(file)
            setAvatar(ObjectUrl)
            setUser({...user , file : e.target.files[0]})
            

        }else{

        setUser({...user , [e.target.name] : e.target.value})
        
        }


    }


    const handleSubmit = () =>{
        let flag = true
        if(!user){

            flag = false 

        }else if(user){

            Object.values(user).some(val =>{
                if(val == '') flag = false
            })

        }
        
        if(!flag){
            notifyFunc(ERROR , FIELD_NOT_HOLLOW , TRUE)
            return
        }


        Object.keys(user).some(key =>{
                switch(key){
                    case 'username' : {

                        if(!regexUsername(user[key])){
                            notifyFunc(ERROR , USER_REGEX , TRUE)
                            flag = false
                        }
                        break
                    }
                    case 'password' : {

                        if(!regexPassword(user[key])){
                            notifyFunc(ERROR , PASSWORD_REGEX , TRUE)
                            flag = false
                        }
                        break
                    }
                    case 'email' :{
                        if(!regexEmail(user[key])){
                            notifyFunc(ERROR , EMAIL_REGEX , TRUE)
                            flag = false
                        }
                        break
                    }
                }
        })

        let form = new FormData()
        Object.keys(user).some(key =>{
            form.append(key,user[key])
        })

        ApiBase.post(urlAddUser , form )
        .then(res => {
            if(res.status == 201){
                navigate('/auth/login' , {state :{
                    username : user.username,
                    password : user.password,
                }})
            }
        })
        .catch(e =>{

            if(e) {
                notifyFunc(ERROR , e.message , TRUE)
            }

        })
    }


    const handleClickAvatar = () =>{
        

    }
    const showLogin = () =>{
        navigate('/auth/login')
    }
    return (
        <div className='register mt-50'>
            <div className="logo logo-register">{LOGO}</div>
            <div className="btn-back-home" onClick={showLogin}><BtnOutLine desc={BTN_TO_LOGIN}></BtnOutLine></div>
            <div className="header">
                <p className='header'>Đăng ký</p>
            </div>
            <div className="form-register">
                <form className="form-info" onSubmit={(e) =>{
                    e.preventDefault()
                }}>
                    {infoRegister && infoRegister.map((e , index) =>{
                        
                        return <>
                        <label style={{width : '100%'}} htmlFor={e[0]}>{e[2]}</label>
                        <input key={index} onChange={handleChange} className="info-register" 
                        id={e[0] && e[0]}
                        type={e[1] && e[1]} 
                        name={e[0] && e[0]} placeholder={e[0] == 'file' ? '' : e[2]} 
                        accept={e[0] == 'file' ? e[2] : ''}/>
                        </>
                    })}
                   
                </form>
                <div className="avatar-demo" >
                <Avatar
                    alt="Remy Sharp"
                    src={avatar && avatar}
                    sx={{ width: 56, height: 56 }}
                    onClick={handleClickAvatar}
                />

                </div>
                <div className="btn-register">
                <button   
                    className='button'
                    onClick={handleSubmit}
                    xs={{backgroundColor : '#00acc1'}}
                    >{BTN_SUBMIT}
                </button>
                </div>
            </div>

            <AlertComponents/>

        </div>
    );
}

export default Register;