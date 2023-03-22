import React, { useState  } from 'react';
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
import { regexEmail, regexPassword, regexUsername } from '../../regex/userInfo.regex';
import useNotifyFunc from '../../hooks/notify.func';
import isValidPhoto from '../../validate/img.validate';
import { ApiBase } from '../../api/api.base';
import Input from '../input/Input';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const fieldCreateUser = [
['username' , 'text' ,'Tên đăng nhập'] ,            
['password' , 'password' , 'Mật khẩu'] ,
['name' , 'text' , 'Họ và tên'] ,
['address' , 'text' , 'Địa chỉ'],
['email' , 'email' , 'Email đăng ký'] ,
['background' , 'file' ,'image/*']
]

function UserForm(props) {
    const field = props.field ;
    const [user , setUser] = useState() ;
    const [avatar , setAvatar] = useState() ;
    const [notifyFunc] = useNotifyFunc()
    const urlAddUser = '/api/users'
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
                if(val === '') flag = false
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
                notifyFunc(SUCCESS , res.data.message , TRUE)
                setUser(undefined)
                document.querySelector('#form-reset').reset()
                setAvatar(undefined)
            }
            
        })
        .catch(e =>{

            if(e) {
                notifyFunc(ERROR , e.response.data.message , TRUE)
            }

        })
    }

    return (
        <div className='register'>
            <div className="header">
                <p className='header'>Đăng ký</p>
            </div>
            <div className="form-register">
                <form className="form-info" id='form-reset' onSubmit={(e) =>{
                    e.preventDefault()
                }}>
                    {fieldCreateUser && fieldCreateUser.map((e , index) =>{
                        return <>
                        <label style={{width : '100%'}} htmlFor={e[0]}>{e[2]}</label>
                        <Input handleChange={handleChange} placeholder={e[2] != 'file' ? e[2] : ''} name={e[0] && e[0]} type={e[1] && e[1]} />
                        </>
                    })}
                     <Box sx={{ minWidth: 120 , width : '60%' }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Chức năng hệ thống</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name='role'
                            value={user && user.role}
                            label="Age"
                            onChange={handleChange}
                            >
                            <MenuItem value={'admin'}>Admin</MenuItem>
                            <MenuItem value={'marketing'}>Marketing</MenuItem>
                            <MenuItem value={'content'}>Nội dung</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </form>
                <div className="avatar-demo" >
                <Avatar
                    alt="Remy Sharp"
                    src={avatar && avatar}
                    sx={{ width: 56, height: 56 }}
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

export default UserForm;