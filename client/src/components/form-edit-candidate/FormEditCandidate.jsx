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
function FormEditCandiate(props) {
    const [candidate , setCandidate] = useState() ;
    const [update , setUpdate] = useState()
    const [contest , setContest] = useState() ;
    const [avatar , setAvatar] = useState()
    const [notifiFunc] = useNotifyFunc()


    const dispatch = useDispatch()

    const open = useSelector(state => state.show.dialogEdit)
    const id = useSelector(state => state.id.id)

    const handleReRender = props.handleReRender

    const urlUpdateCandidate = `/candidate/${id && id}`

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
            setUpdate({...update , [e.target.name] :  e.target.files[0]})
        }
      }else{

    setCandidate({...candidate , [e.target.name] : e.target.value})
    setUpdate({...update , [e.target.name] : e.target.value})

      }

      if(e.target.name === 'isActive'){
        setCandidate({...candidate , isActive : e.target.checked})
        setUpdate({...update , isActive : e.target.checked})
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
      ApiBase.patch(urlUpdateCandidate , form)
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
        const urlGetDetailsCandidate = `/candidate/detail/${id}`
        const urlGetListContest = '/contest'
        ApiBase.get(urlGetDetailsCandidate)
        .then(res =>{
            setCandidate(res.data.candidate)
        })
        .catch(e =>{

            if(e) console.log(e);

        })
        ApiBase.get(urlGetListContest)
        .then(res =>{
            setContest(res.data.listContest)
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
          {"Chỉnh sửa thông thí sinh "}
        </DialogTitle>
        <DialogContent>
               <div className="">
               <label style={{width : '100%'}} htmlFor={candidate && candidate.name}>Tên cuộc thi</label>
                <input  onChange={handleChange} className="info-register" 
                id={candidate && candidate.name}
                type={'text'} 
                name='name'
                value={candidate && candidate.name}
                />
                <label style={{width : '100%'}} htmlFor={candidate && candidate.address}>Địa chỉ</label>
                <input  onChange={handleChange} className="info-register" 
                id={candidate && candidate.address}
                type={'text'} 
                name='address'
                value={candidate && candidate.address}
                />
                <label style={{width : '100%'}} htmlFor={candidate && candidate.email}>Email</label>
                <input  onChange={handleChange} className="info-register" 
                id={candidate && candidate.email}
                type={'text'} 
                name='email'
                value={candidate && candidate.email}
                />
                <label style={{width : '100%'}} htmlFor={candidate && candidate.height}>Chiều cao</label>
                <input  onChange={handleChange} className="info-register" 
                id={candidate && candidate.height}
                type={'text'} 
                name='height'
                value={candidate && candidate.height}
                />
                <label style={{width : '100%'}} htmlFor={candidate && candidate.weight}>Cân nặng</label>
                <input  onChange={handleChange} className="info-register" 
                id={candidate && candidate.weight}
                type={'text'} 
                name='weight'
                value={candidate && candidate.weight}
                />
                <label style={{width : '100%'}} htmlFor={candidate && candidate.measure}>Ba vòng</label>
                <input  onChange={handleChange} className="info-register" 
                id={candidate && candidate.measure}
                type={'text'} 
                name='measure'
                value={candidate && candidate.measure}
                />
                <label style={{width : '100%'}} htmlFor={candidate && candidate.slogan}>Slogan</label>
                <input  onChange={handleChange} className="info-register" 
                id={candidate && candidate.slogan}
                type={'text'} 
                name='slogan'
                value={candidate && candidate.slogan}
                />
                <label style={{width : '100%'}} htmlFor={candidate && candidate.descs}>Mô tả</label>
                <input  onChange={handleChange} className="info-register" 
                id={candidate && candidate.descs}
                type={'text'} 
                name='descs'
                value={candidate && candidate.descs}
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
                <select name="idContest" id="select-status" onChange={handleChange} >
                        <option >Ban tổ chức</option>
                        {contest && contest.map((e , index) =>{
                            return <option  value={e.id}>{e.name}</option>
                        })}
                  </select>
                  <div className="active-contest">
                  <label htmlFor="isActive">Trạng thái</label>
                  <input id='isActive' type="checkbox" onChange={handleChange} name='isActive' checked={candidate && candidate.isActive == true ? true : false} />
                  </div>
                </div>
                </form>
                <div className="avatar-demo" >
                <Avatar
                    alt="Remy Sharp"
                    src={avatar && host+ avatar ? avatar : candidate &&  candidate.background ?host +  candidate.background : '' }
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

export default FormEditCandiate;