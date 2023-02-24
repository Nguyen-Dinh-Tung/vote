import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogEdit } from '../../redux/features/show.slice';
import { setId } from '../../redux/features/id.slice';
import useNotifyFunc from '../../hooks/notify.func';



export default function DialogControler(props) {
  
  const open = useSelector(state => state.show.dialogEdit) ;
  const Render = props.form
  const handleSubmit = props.handleSubmit
  const reRender = props.reRender
  const handleReRender = props.handleReRender
  const dispatch = useDispatch() ;
  const [user , setUser] = React.useState()
  const [notifyFunc] = useNotifyFunc() ;

  const handleClose = () => { 
    dispatch(setDialogEdit(false))
    dispatch(setId(undefined))
  };

  const handleGetdata = (data) =>{
    setUser({...user , ...data})
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
        {Render && <Render/>}
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