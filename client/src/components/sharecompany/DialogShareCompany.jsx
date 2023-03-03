import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { Checkbox, ListItemButton, Pagination, Stack } from '@mui/material';
import { ApiBase, host } from '../../api/api.base';
import useNotifyFunc from '../../hooks/notify.func';
import { ERROR, SUCCESS } from '../../contants/notify/type.notify';
import { TRUE } from '../../contants/notify/status.notify';
import { LIST_NOT_DATA } from '../../contants/notify/message';



export default function DialogShareCompany(props) {
    const open = props.open
    const handleCloseDialogShare = props.handleClose
    const [checked, setChecked] = React.useState([]);
    const [listUser , setListUser] = React.useState()
    const [page , setPage] = React.useState(1)
    const [totalPage , setTotalPage] = React.useState(1)
    const [searchKey , setSearchKey] = React.useState() 
    const refSearch = React.useRef(null)
    const [notifyFunc] = useNotifyFunc() 
    const listIdCompany = props.listIdCompany
  const handleClose = () => {
    handleCloseDialogShare()
  };


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleChangePage = (e , page)=>{
    setPage(page)
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
        setTotalPage(Math.ceil(res.data.listUser.length / 8))
        setChecked([])
    })
    .catch(e =>{
      if(e){
        notifyFunc(ERROR , e.response.data.message , TRUE)
        setChecked([])

      }
    })

  },[searchKey , page])

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Chia sẻ quyền quản lý tổ chức?"}
        </DialogTitle>
        <DialogContent>
            <input id='search' type="text" name='search' placeholder='Tìm tài khoản hoặc tên người dùng ...' onChange={handChangeSearchKey}/>
        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {listUser && listUser.map((e) => {
              return (
                <ListItem
                  key={e &&e.id}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(e &&e.id)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={submitShare} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}