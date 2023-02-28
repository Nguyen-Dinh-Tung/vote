import { Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApiBase, host } from '../../../api/api.base';
import { EMAIL_REGEX, FIELD_NOT_HOLLOW, IMG_VALIDATE, PASSWORD_REGEX, USER_REGEX } from '../../../contants/notify/notify.register';
import { TRUE } from '../../../contants/notify/status.notify';
import { ERROR } from '../../../contants/notify/type.notify';
import useNotifyFunc from '../../../hooks/notify.func';
import { regexEmail, regexPassword, regexUsername } from '../../../regex/userInfo.regex';
import isValidPhoto from '../../../validate/img.validate';
import '../index.css' ;
const fieldEditUser = [
    ['oldPassword' , 'password' , 'Mật khẩu cũ'] ,
    ['newPassword' , 'password' , 'Mật khẩu mới'] ,
    ['name' , 'text' , 'Họ và tên'] ,
    ['address' , 'text' , 'Địa chỉ'],
    ['email' , 'email' , 'Email đăng ký'] ,
    ]
function FormEditUser(props) {
    const [user , setUser] = useState() ;
    const [avatar , setAvatar] = useState() ;
    const flag = props.flag
    const [notifyFunc] = useNotifyFunc() ;
    const id = useSelector(state => state.id.id) ;
    const userGetDetailsUser = `/users/details/${id && id}`
    const handleGetdata = props.handleGetdata ;
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
            handleGetdata({file : e.target.files[0]})
            setUser({...user ,file : e.target.files[0]})
            
        }else{
            setUser({[e.target.name] : e.target.value})
        handleGetdata({[e.target.name] : e.target.value})
        }

    }
    
        

    const handleClickAvatar = () =>{

    }

    useEffect(() =>{
        ApiBase.get(userGetDetailsUser)
        .then(res =>{
            setUser({
                username :  res.data.user.username,
                name :  res.data.user.name,
                isActive :  res.data.user.isActive,
                email :  res.data.user.email,
                address :  res.data.user.address,

            })
            setAvatar(host + res.data.user.background)
        })
        .catch(e =>{
            console.log(e);
        })
    },[])
    return (
        <div>
            <p>{user && user.username}</p>
            <form id="form-edit-user">
            {fieldEditUser && fieldEditUser.map((e,index) =>{
                return <>
                <label style={{display: 'flex' , width : '100%'}} htmlFor={e[0]}>{e[2]}</label>
                <input className="info-register" id={e[0]} onChange={handleChange} placeholder={e[2] != 'file' ? e[2] : ''} 
                name={e[0] && e[0]} type={e[1] && e[1]} 
                value={user && user[e[0]]}
                 />
                 </>
            })}
            <input className="info-register" onChange={(e) =>{
                handleChange(e)
            }} type={'file'} name="background"  accept="image/*"/>
            
            </form>
            <div className="select-status">
            <select id='select-status' name="isActive" placeholder='Trạng thái' onChange={handleChange} >
                <option value={1} selected={user && user.isActive == true ? true : ''} >Hoạt động</option>
                <option value={0} selected={user && user.isActive == false ? false : ''} >Dừng</option>
            </select>
            </div>
            <div className="a" style={{display : 'flex' , justifyContent : 'center' , marginTop : '20px'}}>
            <Avatar
                    alt="Remy Sharp"
                    src={avatar && avatar}
                    sx={{ width: 56, height: 56 }}
                    onClick={handleClickAvatar}
                />
            </div>
        </div>
    );
}

export default FormEditUser;