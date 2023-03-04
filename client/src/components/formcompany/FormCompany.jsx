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
import { ApiBase, host } from '../../api/api.base';
import { LOGO } from '../../pages/login/intro';
import { ADDCONTEST, ADD_COMPANY } from '../../contants/field.desc';
import { ADD_COMPANY_SUCCESS, ADD_CONTEST_SUCCESS, LIST_NOT_DATA } from '../../contants/notify/message';
import { Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination, Stack } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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


    const open = props.open
    const handleCloseDialogShare = props.handleClose
    const [checked, setChecked] = React.useState([]);
    const [listUser , setListUser] = React.useState()
    const [page , setPage] = React.useState(1)
    const [totalPage , setTotalPage] = React.useState(1)
    const [searchKey , setSearchKey] = React.useState() 
    const [totalDemoPage , setTotalDemoPage] = useState(1)
    const [demoPage , setDemoPage] = useState(1)
    const refSearch = React.useRef(null)
    const [listSelectDemo , setListSelectDemo] = useState([])
    const listIdCompany = props.listIdCompany
  const handleClose = () => {
    handleCloseDialogShare()
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value.id);
    const newChecked = [...checked];
    const listDemo = [...listSelectDemo]
    if (currentIndex === -1) {
      newChecked.push(value.id);
      listDemo.push(value)
    } else {
      newChecked.splice(currentIndex, 1);
      listDemo.splice(currentIndex,1)
    }

    setChecked(newChecked);
    setTotalDemoPage(Math.ceil(listDemo.length /8))
    setListSelectDemo(listDemo)
  };

  const handleChangePage = (e , page)=>{
    setPage(page)
}
    const handleChangeDemoPage = (e , page) =>{
        setDemoPage(page)
    }
const submitShare = () =>{
  if(checked.length < 1){
    notifyFunc(ERROR , LIST_NOT_DATA , TRUE)
    return
  }
  let newShare = {
    idCompany : listIdCompany ,
    idUser : checked
  }

  const urlAddNewUcp = '/user-cp'
  ApiBase.post(urlAddNewUcp,newShare)
  .then(res =>{

    if(res.status === 201){
      notifyFunc(SUCCESS , res.data.message , TRUE)
      handleClose()
    }
    
  })
  .catch(e =>{
    if(e){
      notifyFunc(ERROR , e.response.data.message , TRUE)
      handleClose()
    }
  })
}
const handleRemoveSelectDemo = (id) =>{
    listSelectDemo.map((e , index)=>{
        if(e.id === id){
            listSelectDemo.splice(index,1)
            checked.splice(index,1)
        }

    })
    setListSelectDemo([...listSelectDemo])
    setChecked([...checked])
    setTotalDemoPage(Math.ceil(listSelectDemo.length / 8))
}

const handChangeSearchKey = (e) =>{
  if(searchKey ==! '')
  setPage(1)

  let value = e.target.value ;

  if(refSearch.current)
  clearTimeout(refSearch.current)

  refSearch.current = setTimeout(() =>{

    if(value !== ''){

          setSearchKey(value)

      }else{

          setSearchKey('')

      }
  },1000)

}
  React.useEffect(() =>{
    let urlEntity = `/users/${page}` ;
    
    if(searchKey !== undefined && searchKey !== '')
    urlEntity += `?search=${searchKey}`

    ApiBase.get(urlEntity)
    .then(res =>{
        setListUser(res.data.listUser)
        setTotalPage(Math.ceil(res.data.total / 8))
        setChecked([])
    })
    .catch(e =>{
      if(e){
        
        notifyFunc(ERROR , e.response.data.message , TRUE)
        setChecked([])

      }
    })

  },[searchKey , page])
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
            Object.values(company).some(val =>{
                if(val == '') {
                    flag = false
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
            if(res.status == 201){
                notifyFunc(SUCCESS , ADD_COMPANY_SUCCESS , TRUE)
                setAvatar(undefined)
                setCompany({
                    name : '' ,
                    address : '' ,
                    file : undefined ,
                    slogan : '' ,
                    description : '' ,
                    email : ''
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
                    <div className="box-demo">
                        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <p>Danh sách tài khoản</p>
                                {listUser && listUser.map((e) => {
                                return (
                                    <ListItem
                                    key={e &&e.id}
                                    secondaryAction={
                                        <Checkbox
                                        edge="end"
                                        onChange={handleToggle(e && e)}
                                        checked={checked.indexOf(e &&e.id) !== -1}
                                        inputProps={{ 'aria-labelledby': e &&e.id }}
                                        />
                                    }
                                    disablePadding
                                    >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                        <Avatar
                                            alt={`Avatar n°${e && e.name}`}
                                            src={e && host + e.background}
                                        />
                                        </ListItemAvatar>
                                        <ListItemText id={e && e.id} primary={` ${e && e.username} - ${e && e.name}`} />
                                    </ListItemButton>
                                    </ListItem>
                                );
                                })}
                            <div className="pagani-page">
                                <Stack spacing={2}>
                                    <Pagination count={totalPage && totalPage} variant="outlined" color="primary" onChange={handleChangePage} />
                                </Stack> 
                            </div>
                        </List>
                        <div className="box-selected">
                        <p>Danh share</p>
                            {listSelectDemo && listSelectDemo.map((e,index) =>{
                                let limit = 8 ;
                                let offset = limit * demoPage - limit
                                let count = 0 ;
                                console.log(offset);

                                if(index >= offset && index < limit){
                                    console.log('check');
                                    return<div className="task-demo">
                                    <Avatar
                                    alt="Remy Sharp"
                                    src={e && host + e.background}
                                    onClick={handleClickAvatar}
                                    />
                                    <p>{e && e.username}</p>
                                    <HighlightOffIcon onClick={() =>{
                                        handleRemoveSelectDemo(e.id)
                                    }}/>
                                    </div>
                                }
                                
                            })}
                            <div className="pagani-page">
                                <Stack spacing={2}>
                                    <Pagination count={totalDemoPage && totalDemoPage} variant="outlined" color="primary" onChange={handleChangeDemoPage} />
                                </Stack> 
                            </div>
                        </div>
                    </div>
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