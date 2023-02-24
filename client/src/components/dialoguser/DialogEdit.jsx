import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogEdit } from '../../redux/features/show.slice';
import FormEditUser from '../form/edituser/FormEditUser';
import { setId } from '../../redux/features/id.slice';
import { ERROR, SUCCESS, WARNING } from '../../contants/notify/type.notify';
import { EMAIL_REGEX, FIELD_NOT_HOLLOW, PASSWORD_DUBLICATE, PASSWORD_EDIT, PASSWORD_REGEX, USER_REGEX } from '../../contants/notify/notify.register';
import { TRUE } from '../../contants/notify/status.notify';
import useNotifyFunc from '../../hooks/notify.func';
import { regexEmail, regexPassword, regexUsername } from '../../regex/userInfo.regex';
import { ApiBase } from '../../api/api.base';

export default function DialogEdit(props) {

  const open = useSelector(state => state.show.dialogEdit) ;
  const id = useSelector(state => state.id.id) ;

  const reRender = props.reRender ;
  const handleReRender = props.handleReRender ;
  const dispatch = useDispatch() ;
  const [user , setUser] = React.useState()
  const urlUpdateUser = '/users/'
  const [notifyFunc] = useNotifyFunc() ;

  const handleClose = () => { 
    dispatch(setDialogEdit(false))
    dispatch(setId(undefined))
  };

  const handleGetdata = (data) =>{
    setUser({...user , ...data})
  }
  const handleSubmit = () =>{

    if(user){
      if(user['newPassword'] && user['oldPassword']){
        if(user['newPassword'] == user['oldPassword']){
           notifyFunc(WARNING , PASSWORD_DUBLICATE , TRUE)
           return
        }
      }
      if(user['newPassword'] || user['oldPassword']){

        if(!user['newPassword'] || !user['oldPassword']){
          return notifyFunc(WARNING , PASSWORD_EDIT , TRUE)
        }

      }

        Object.keys(user).some(key =>{
                switch(key){
                    case 'username' : {
                      if(!regexUsername(user[key])){
                        return notifyFunc(ERROR , USER_REGEX , TRUE)
                        }
                        break
                    }
                    case 'newPassword' : {

                        if(!regexPassword(user[key])){
                            return notifyFunc(ERROR , PASSWORD_REGEX , TRUE)
                        }
                        
                        break
                      }
                      case 'oldPassword' : {

                        if(!regexPassword(user[key])){
                          return notifyFunc(ERROR , PASSWORD_REGEX , TRUE)
                        }
                        
                      break
                  }
                    case 'email' :{
                      if(!regexEmail(user[key])){
                            return notifyFunc(ERROR , EMAIL_REGEX , TRUE)
                      }
                        break
                    }
                }
        })
        Object.keys(user).some(key =>{
          switch(key){
            case "address": {
              if(user[key] == ""){
                          return notifyFunc(WARNING , FIELD_NOT_HOLLOW , TRUE)
              }

            }
            case "email": {
              if(user[key] == ""){
                          return notifyFunc(WARNING , FIELD_NOT_HOLLOW , TRUE)
              }
              break
            }
            case "name": {
              if(user[key] ==""){
                          return notifyFunc(WARNING , FIELD_NOT_HOLLOW , TRUE)
              }
              break
            }

          }
        })
        let form = new FormData()
        Object.keys(user).some(key =>{
            form.append(key,user[key])
        })
        ApiBase.patch(urlUpdateUser + id , form)
        .then(res =>{
          if(res.status == 200){
            notifyFunc(SUCCESS , res.data.message , TRUE)
            dispatch(setDialogEdit(false))
            handleReRender()
            setUser(undefined)
          }
        })
        .catch(e =>{
          notifyFunc(ERROR , e.response.data.message , TRUE)
          handleReRender()
        })
    }

  } 
  return (
    <div>
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
          <FormEditUser handleGetdata={handleGetdata}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleSubmit} >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}