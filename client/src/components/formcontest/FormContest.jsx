import React, { useEffect, useState  } from 'react';
import { useNavigate } from "react-router-dom";

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
import { ApiBase, host } from '../../api/api.base';
import { LOGO } from '../../pages/login/intro';
import { ADDCONTEST } from '../../contants/field.desc';
import { ADD_CONTEST_SUCCESS } from '../../contants/notify/message';
import { Button, Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination } from '@mui/material';
import { Stack } from '@mui/system';
import UserShare from '../user-share/UserShare';
import CandidateShare from '../candidate-share/CandidateShare';
import CompanyShare from '../contest-share/CompanyShare';
const infoRegister = [
['name' , 'text' , 'Tên cuộc thi '] ,
['slogan' , 'text' , 'Slogan cuộc thi'] ,
['description' , 'text' , 'Mô tả cuộc thi'] ,
['address' , 'text' , 'Địa chỉ tổ chức cuộc thi'],
['email' , 'email' , 'Email đăng ký'] ,
['background' , 'file' ,'image/*']
]
function FormContest(props) {

    const [contest , setContest] = useState({
        name : '' ,
        idCompany : '' ,
        address : '' ,
        file : undefined ,
        slogan : '' ,
        description : '' ,
        email : ''
    }) ;
    const [avatar , setAvatar] = useState() ;
    const [company , setCompany] = useState()
    const [step , setStep] = useState(1)
    const [notifyFunc] = useNotifyFunc()
    const [listIdUserShare , setListIdUserShare] = useState()
    const [listIdCandidate , setListIdCandidate] = useState()
    const [listIdCompany , setListIdCompany] = useState()
    const urlAddContest = '/contest'
    const urlGetListCompany = '/company/1'





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
            setContest({...contest , file : e.target.files[0]})
            

        }else{

        setContest({...contest , [e.target.name] : e.target.value})
        
        }


    }

    const nextStep = () =>{
        if(step < 4 && step>=1)
        setStep(step+1)
    }
    const backStep = () =>{
        if(step > 1)
        setStep(step - 1)
    }

    
    
    const handleChangeListUserShare = (data) =>{
        setListIdUserShare(data)
    }

    const handleChangeListCandidateShare = (data) =>{
        setListIdCandidate(data)
    }
    const handleChangeListCompanyShare = (data) =>{
        setListIdCompany(data)
    }
    const handleSubmit = () =>{
        let flag = true

        if(!contest){

            flag = false 

        }else if(contest){

            Object.values(contest).some(val =>{
                if(val == '') flag = false
            })

        }
        
        if(!flag){
            notifyFunc(ERROR , FIELD_NOT_HOLLOW , TRUE)
            return
        }
        if(contest['email']){
            if(!regexEmail(contest.email)){
                notifyFunc(ERROR , EMAIL_REGEX , TRUE)
                flag = false
                return
            }
        }
        let form = new FormData()
        Object.keys(contest).some(key =>{
            form.append(key,contest[key])
        })
        form.append('share' , JSON.stringify({
            listIdCandidate : listIdCandidate ,
            listIdUser : listIdUserShare
        }))
        ApiBase.post(urlAddContest , form )
        .then(res => {
            if(res.status == 201){
                console.log(res);
                notifyFunc(SUCCESS , ADD_CONTEST_SUCCESS , TRUE)
                setAvatar(undefined)
                setContest({
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

    useEffect(() =>{
        ApiBase.get(urlGetListCompany)
        .then(res =>{
            setCompany(res.data.listCompany)
        })
        .catch(e =>{
            if(e) console.log(e);
        })
    },[])


    return (
        <div className='register mt-50'>
            <div className="header">
                <p className='header'>
                    {step === 1 ? ADDCONTEST : 
                    step === 4 ? "Chia sẻ quyền quản lý cuộc thi " : step === 2 ?
                        "Thêm tổ chức phát triển" : step === 3?
                        "Thêm thí sinh vào cuộc thi " : ""
                }
                </p>
            </div>
            {step && step === 1 
            ? 
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
                        value={contest && contest[e[0]]}
                        accept={e[0] == 'file' ? e[2] : ''}/>
                        </>
                    })}
                    <select name="idCompany" id="select-status" onChange={handleChange} onLoad={(e) =>{
                        setContest({...contest , [e.target.name] : e.target.value})
                    }}>
                        <option value="-1">Ban tổ chức</option>
                        {company && company.map((e , index) =>{
                            return <option  value={e.id}>{e.name}</option>
                        })}
                    </select>
                </form>
                <div className="avatar-demo" >
                <Avatar
                    alt="Remy Sharp"
                    src={avatar && avatar}
                    sx={{ width: 56, height: 56 }}
                />

                </div>

            </div>
            
            : step === 2  
            
            ?
            <CompanyShare handleGetData={handleChangeListCompanyShare}/>
            : step === 3 ? 
            <CandidateShare handleGetData={handleChangeListCandidateShare}/>
            : step === 4 
            ? 
            <UserShare handleGetData={handleChangeListUserShare}/>
            :""
            }

            <div className="btn-register">
                    <button   
                        className='button'
                        onClick={handleSubmit}
                        xs={{backgroundColor : '#00acc1'}}
                        >{ADDCONTEST}
                    </button>
                    </div>
            {step && step > 0 && step <4 
            ? 
                <div style={{
                    position : 'absolute' ,
                    right : '0' ,
                    top : '50%' ,
                    transform : 'translateX(-50%)'
                }}>
                <Button color="secondary" 
                        variant="outlined"
                    onClick={nextStep}
                >
                    Tiếp theo
                </Button>
                </div>
            : ''
            }

            {step && step >1 && step <=4 
            ? 
                    <div style={{
                        position : 'absolute' ,
                        left : '10%' ,
                        top : '50%' ,
                        transform : 'translateX(-50%)'
                    }}>
                    <Button color="secondary" 
                            variant="outlined"
                        onClick={backStep}
                    >
                        Trở lại
                    </Button>
                    </div> 
            : ''    
            }
            <AlertComponents/>

        </div>
    );
}

export default FormContest;