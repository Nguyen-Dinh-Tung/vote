import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiBase, host } from '../../api/api.base';
import { EDIT_CONTEST } from '../../contants/field.desc';
import { NOT_CHANGE } from '../../contants/notify/message';
import { EMAIL_REGEX, FIELD_NOT_HOLLOW, IMG_VALIDATE } from '../../contants/notify/notify.register';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR, SUCCESS, WARNING } from '../../contants/notify/type.notify';
import useNotifyFunc from '../../hooks/notify.func';
import { setDialogEdit } from '../../redux/features/show.slice';
import { regexEmail } from '../../regex/userInfo.regex';
import isValidPhoto from '../../validate/img.validate';
import './index.css'
function FormEditContest(props) {
    const [contest , setContest] = useState() ;
    const [update , setUpdate] = useState()
    const [company , setCompany] = useState() ;
    const [avatar , setAvatar] = useState()
    const [notifiFunc] = useNotifyFunc()


    const dispatch = useDispatch()

    const open = useSelector(state => state.show.dialogEdit)
    const id = useSelector(state => state.id.id)

    const handleReRender = props.handleReRender

    const urlUpdateContest = `/contest/${id && id}`

    const handleChange = (e) =>{
      if(e.target.name == "file"){
        let file = e.target.files[0] 
        if(file){
            if(!isValidPhoto(file.type)){
            notifiFunc(ERROR , IMG_VALIDATE , TRUE)
            document.querySelector('#background').reset()
            return
            }
            let ObjectUrl = URL.createObjectURL(file)
            setAvatar(ObjectUrl)
            setUpdate({...contest , [e.target.name] :  e.target.files[0]})
        }
      }else{

      setContest({...contest , [e.target.name] : e.target.value})
      setUpdate({...update , [e.target.name] : e.target.value})

      }

      if(e.target.name === 'isActive'){
        setContest({...contest , isActive : e.target.checked})
        setUpdate({...contest , isActive : e.target.checked})
      }
      
    }
    const handleSubmit = () =>{
      let flag = true ;
      if(!update){
        notifiFunc(WARNING , NOT_CHANGE , TRUE)
        return
      }
      
      Object.values(update).some(val =>{
        if(val === ''){
          flag = false
        }
      })
      if(!flag)
      return notifiFunc(ERROR , FIELD_NOT_HOLLOW, TRUE)

      if(update['email']){
        if(!regexEmail(update.email)){
          notifiFunc(ERROR , EMAIL_REGEX , TRUE)
          return
        }
      }
      let form = new FormData()

      Object.keys(update).some(key =>{
        form.append(key , update[key])
      })
      ApiBase.patch(urlUpdateContest , form)
      .then(res =>{
        if(res.status === 200){
          setUpdate(undefined)
          notifiFunc(SUCCESS , res.data.message ,TRUE)
          document.querySelector('#background').reset()
          handleReRender()
          dispatch(setDialogEdit(false))
          return
        }else{
          notifiFunc(ERROR , res.data.message , TRUE)

        }
      })
      .catch(e =>{

        if(e) {
          console.log(e);
        }
      })
    }

    const handleClose = () =>{
        dispatch(setDialogEdit(false))
    }

    useEffect(() =>{

        const urlGetDetailsContest = `/contest/detail/${id}`
        const urlGetListCompany = '/company'
        ApiBase.get(urlGetDetailsContest)
        .then(res =>{
            setContest(res.data.contest)
        })
        .catch(e =>{

            if(e) console.log(e);

        })
        ApiBase.get(urlGetListCompany)
        .then(res =>{
          setCompany(res.data)
        })
        .catch(e =>{
          if(e) console.log(e);
        })

    },[])

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Chỉnh sửa thông tin tài khoản "}
        </DialogTitle>
        <DialogContent>
               <div className="">
               <label style={{width : '100%'}} htmlFor={contest && contest.name}>Tên cuộc thi</label>
                <input  onChange={handleChange} className="info-register" 
                id={contest && contest.name}
                type={'text'} 
                name='name'
                value={contest && contest.name}
                />
                <label style={{width : '100%'}} htmlFor={contest && contest.address}>Địa chỉ</label>
                <input  onChange={handleChange} className="info-register" 
                id={contest && contest.address}
                type={'text'} 
                name='address'
                value={contest && contest.address}
                />
                <label style={{width : '100%'}} htmlFor={contest && contest.email}>Email</label>
                <input  onChange={handleChange} className="info-register" 
                id={contest && contest.email}
                type={'text'} 
                name='email'
                value={contest && contest.email}
                />
                <label style={{width : '100%'}} htmlFor={contest && contest.slogan}>Slogan</label>
                <input  onChange={handleChange} className="info-register" 
                id={contest && contest.slogan}
                type={'text'} 
                name='slogan'
                value={contest && contest.slogan}
                />
                <label style={{width : '100%'}} htmlFor={contest && contest.descs}>Mô tả</label>
                <input  onChange={handleChange} className="info-register" 
                id={contest && contest.descs}
                type={'text'} 
                name='descs'
                value={contest && contest.descs}
                />
                <form id="background">
                <label style={{width : '100%'}} htmlFor={'avatar'}>Ảnh</label>
                <input  onChange={handleChange} className="info-register" 
                id={'avatar'}
                type={'file'} 
                name='file'
                accept='image/*'
                />
                <div className="option-edit-contest">
                <select name="idCompany" id="select-status" onChange={handleChange} >
                        <option >Ban tổ chức</option>
                        {company && company.map((e , index) =>{
                            return <option  value={e.id}>{e.name}</option>
                        })}
                  </select>
                  <div className="active-contest">
                  <label htmlFor="isActive">Trạng thái</label>
                  <input id='isActive' type="checkbox" onChange={handleChange} name='isActive' checked={contest && contest.isActive == true ? true : false} />
                  </div>
                </div>
                </form>
                <div className="avatar-demo" >
                <Avatar
                    alt="Remy Sharp"
                    src={avatar && host+ avatar ? avatar : contest &&  contest.background ?host +  contest.background : '' }
                    sx={{ width: 56, height: 56 }}
                />

                </div>
               </div>

        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleSubmit} >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    );
}

export default FormEditContest;