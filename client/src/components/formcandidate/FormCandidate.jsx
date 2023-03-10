import React, { useEffect, useState  } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

import BtnOutLine from '../../components/button/BtnOutLine';
import { BTN_SUBMIT, BTN_TO_LOGIN } from '../../contants/btn';
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
import { ADDCONTEST, ADD_CANDIDATE } from '../../contants/field.desc';
import { ADD_CONTEST_SUCCESS } from '../../contants/notify/message';
import UserShare from '../user-share/UserShare';
import CompanyShare from '../contest-share/ContestShare';

const infoRegister = [
['idno' , 'text' , 'Số báo danh'] ,
['name' , 'text' , 'Tên thí sinh '] ,
['email' , 'email' , 'Email đăng ký'] ,
['address' , 'text' , 'Địa chỉ '],
['weight' , 'text' , 'Cân nặng '] ,
['height' , 'text' , 'Chiều cao'] ,
['measure' , 'text' , 'Số đo 3 vòng'] ,
['slogan' , 'text' , 'Slogan'] ,
['descs' , 'text' , 'Chia sẻ'] ,
['background' , 'file' ,'image/*']
]
function FormCandidate(props) {

    const [candidate , setCandidate] = useState({
        name : '' ,
        address : '' ,
        file : undefined ,
        email : '' ,
        slogan : '' ,
        descs : '' ,
        height : '' ,
        weight : '',
        idno : '',
        measure : '',
    }) ;
    const [avatar , setAvatar] = useState() ;
    const [contests , setContests] = useState()
    const dispatch = useDispatch()
    const [notifyFunc] = useNotifyFunc()
    const [step , setStep] = useState(1)
    const [listIdUsers , setListIdUsers] = useState()
    const [listIdContest , setListIdContest] = useState()
    const urlGetListContest = '/contest'
    const urlAddCandidate = '/candidate'

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
            setCandidate({...candidate , file : e.target.files[0]})
            

        }else{

            setCandidate({...candidate , [e.target.name] : e.target.value})
        
        }


    }
    const handleChangeListUserShare = (data) =>{
        setListIdUsers(data)
    }
    const handleChangeListContestShare = (data) =>{
        setListIdContest(data)
    }

    const handleSubmit = () =>{
        let flag = true
        if(!candidate){

            flag = false 

        }else if(candidate){
            console.log(candidate);
            Object.values(candidate).some(val =>{
                if(val == ''){

                    flag = false

                }
            })

        }
        
        if(!flag){
            notifyFunc(ERROR , FIELD_NOT_HOLLOW , TRUE)
            return
        }
        if(candidate['email']){
            if(!regexEmail(candidate.email)){
                notifyFunc(ERROR , EMAIL_REGEX , TRUE)
                flag = false
                return
            }
        }
        let form = new FormData()
        Object.keys(candidate).some(key =>{
            form.append(key,candidate[key])
        })
        if(listIdContest.length > 0 || listIdUsers.length > 0)
        form.append('share' , JSON.stringify({
            listIdContest ,
            listIdUsers
        }))
        ApiBase.post(urlAddCandidate , form )
        .then(res => {
            console.log(res);
            if(res.status == 201){
                notifyFunc(SUCCESS , res.data.message , TRUE)
                setAvatar(undefined)
                setCandidate({
                    name : '' ,
                    address : '' ,
                    file : undefined ,
                    email : '' ,
                    slogan : '' ,
                    descs : '' ,
                    height : '' ,
                    weight : '',
                    idno : '',
                    measure : '',
                })
                document.querySelector('.form-info').reset()
            }
        })
        .catch(e =>{

            if(e) {
                notifyFunc(ERROR , e.response.data.message , TRUE)
            }

        })
    }



    const nextStep = () =>{
        if(step < 3 && step>=1)
        setStep(step+1)
    }
    const backStep = () =>{
        if(step > 1)
        setStep(step - 1)
    }


    useEffect(() =>{
        // ApiBase.get(urlGetListContest)
        // .then(res =>{
        //     console.log(res);
        //     setContests(res.data.listContest)
        // })
        // .catch(e =>{
        //     if(e) console.log(e);
        // })
    },[])
    return (
        <div className='register mt-50'>
            <div className="header">
                <p className='header'>{

                    step  && step === 1 ? ADD_CANDIDATE :
                    step && step === 2 ? "Chọn cuộc thi tham gia" :
                    step && step === 3 ? "Chia sẻ quyền quản lý" :""

                }</p>
            </div>
            <div className="form-register">
                {step && step === 1 ? <>
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
                    {/* <select name="idContest" id="select-status" onChange={handleChange} onLoad={(e) =>{
                        setCandidate({...candidate , [e.target.name] : e.target.value})
                    }}>
                        <option value="-1">Cuộc thi</option>
                        {contests && contests.map((e , index) =>{
                            return <option  value={e.id}>{e.name}</option>
                        })}
                    </select> */}
                </form>
                <div className="avatar-demo" >
                <Avatar
                    alt="Remy Sharp"
                    src={avatar && avatar}
                    sx={{ width: 56, height: 56 }}
                />

                </div>
                </>: 
                
                step === 3 ? 
                <UserShare 
                handleGetData={handleChangeListUserShare}/> :
                step === 2 ?
                <CompanyShare 
                handleGetData={handleChangeListContestShare}/> : ''
                }
                <div className="btn-register">
                <button   
                    className='button'
                    onClick={handleSubmit}
                    xs={{backgroundColor : '#00acc1'}}
                    >{ADD_CANDIDATE}
                </button>
                </div>
            </div>
            {step && step > 0 && step <3 
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

            {step && step >1 && step <=3 
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

export default FormCandidate;