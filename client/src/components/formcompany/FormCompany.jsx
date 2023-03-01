import React, { useEffect, useState  } from 'react';
import { useNavigate } from "react-router-dom";

import BtnOutLine from '../../components/button/BtnOutLine';
import { BTN_SUBMIT, BTN_TO_LOGIN } from '../../contants/btn';
import './index.css'
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR, SUCCESS } from '../../contants/notify/type.notify';
import { EMAIL_REGEX, FIELD_NOT_HOLLOW, IMG_VALIDATE, PASSWORD_MIN, PASSWORD_REGEX, USER_MIN_LENGTH, USER_REGEX } from '../../contants/notify/notify.register';
import AlertComponents from '../../components/alert/Alert';
import {setAlert} from '../../redux/features/show.slice'
import { regexEmail, regexPassword, regexUsername } from '../../regex/userInfo.regex';
import useNotifyFunc from '../../hooks/notify.func';
import isValidPhoto from '../../validate/img.validate';
import { ApiBase } from '../../api/api.base';
import { LOGO } from '../../pages/login/intro';
import { ADDCONTEST, ADD_COMPANY } from '../../contants/field.desc';
import { ADD_COMPANY_SUCCESS, ADD_CONTEST_SUCCESS } from '../../contants/notify/message';

const infoRegister = [
['name' , 'text' , 'Tên tổ chức '] ,
['slogan' , 'text' , 'Slogan tổ chức'] ,
['descs' , 'text' , 'Mô tả tổ chức'] ,
['bss' , 'text' , 'Lĩnh vực phát triển'] ,
['address' , 'text' , 'Văn phòng'],
['email' , 'email' , 'Email đăng ký'] ,
['background' , 'file' ,'image/*']
]
function FormCompany(props) {

    const [company , setCompany] = useState({
        name : '' ,
        address : '' ,
        file : undefined ,
        slogan : '' ,
        email : '' ,
        bss : '',
        descs : '',
    }) ;
    const [avatar , setAvatar] = useState() ;
    const dispatch = useDispatch()
    const [notifyFunc] = useNotifyFunc()
    const urlCompany = '/company'


    const navigate = useNavigate()
    const handleChange = (e) =>{
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
            setCompany({...company , file : e.target.files[0]})
            

        }else{

        setCompany({...company , [e.target.name] : e.target.value})
        
        }


    }


    const handleSubmit = () =>{
        let flag = true
        if(!company){

            flag = false 

        }else if(company){
            console.log(company);
            Object.values(company).some(val =>{
                if(val == '') {
                    flag = false
                    console.log(val);

                }
            })

        }
        
        if(!flag){
            notifyFunc(ERROR , FIELD_NOT_HOLLOW , TRUE)
            return
        }
        if(company['email']){
            if(!regexEmail(company.email)){
                notifyFunc(ERROR , EMAIL_REGEX , TRUE)
                flag = false
                return
            }
        }
        let form = new FormData()
        Object.keys(company).some(key =>{
            form.append(key,company[key])
        })
        ApiBase.post(urlCompany , form )
        .then(res => {
            console.log(res);
            if(res.status == 201){
                notifyFunc(SUCCESS , ADD_COMPANY_SUCCESS , TRUE)
                setAvatar(undefined)
                setCompany({
                    name : '' ,
                    idCompany : '' ,
                    address : '' ,
                    file : undefined ,
                    slogan : '' ,
                    description : '' ,
                    email : ''
                })
                document.querySelector('.form-info').reset()
                .catch(e =>{
                    if(e)
                    notifyFunc(ERROR , e.response.data.message , TRUE)
                })
            }
        })
        .catch(e =>{

            if(e) {
                notifyFunc(ERROR , e.response.data.message , TRUE)
            }

        })
    }


    const handleClickAvatar = () =>{
        

    }

    return (
        <div className='register mt-50'>
            <div className="header">
                <p className='header'>{ADD_COMPANY}</p>
            </div>
            <div className="form-register">
                <form className="form-info" onSubmit={(e) =>{
                    e.preventDefault()
                    
                }}
                >
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
                    >{ADD_COMPANY}
                </button>
                </div>
            </div>

            <AlertComponents/>

        </div>
    );
}

export default FormCompany;