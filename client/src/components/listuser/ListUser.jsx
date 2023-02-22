import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiBase, host } from '../../api/api.base';
import { FORBIDDEN } from '../../contants/notify/message';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR } from '../../contants/notify/type.notify';
import useNotifyFunc from '../../hooks/notify.func';
import './index.css'
import SettingsIcon from '@mui/icons-material/Settings';
import DialogEdit from '../dialog/DialogEdit';
import { setDialogEdit } from '../../redux/features/show.slice';
import { setId } from '../../redux/features/id.slice';
function ListUser(props) {
    const urlGetListUser = `/users` ;
    const open = useSelector(state => state.show.dialogEdit) ;
    const handleReRender = props.handleReRender
    const dispatch = useDispatch()
    const [notifyFunc] = useNotifyFunc() 
    const [listUser , setListUser] = useState()
    const reRender = props.reRender
    const setTing = () =>{
        dispatch(setDialogEdit(true))
    }
    const handleSelectId = (id)=>{
        dispatch(setId(id))
    }
    useEffect(() =>{
        ApiBase.get(urlGetListUser)
        .then(res =>{
            console.log(res);
            setListUser(res.data.listUser)
        })
        .catch(e =>{
            if(e.response.status == 403)
            notifyFunc(ERROR , FORBIDDEN , TRUE)
        })
    },[reRender])
    return (
        <div className='table-user'>
            <p className='header-list-user'>Quản lý tài khoản</p>
            <table className='list-user'>
                <thead>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Chức vụ</th>
                <th>Avatar</th>
                <th>Trạng thái</th>
                <th>Tùy chỉnh</th>
                </thead>
                <tbody>
                    {listUser && listUser.length >0 ? 
                    
                    listUser.map((e , index) =>{
                        return <tr className='tr-list-user' >
                            <td>{e && e.name}</td>
                            <td>{e && e.email}</td>
                            <td>{e && e.address}</td>
                            <td>{e && e.role}</td>
                            <td className='align-center'><img className='user-list-avatar' src={e &&host + e.background} alt="" /></td>
                            <td>{e && e.isActive == true ? "Hoạt động" : 'Dừng'}</td>
                            <td className='align-center cursor-pointer'><SettingsIcon color="secondary" onClick={() => {handleSelectId(e.id) ; setTing()}} sx={{fontSize : '30px'}}/></td>
                        </tr>
                    })
                    : ''}
                </tbody>
            </table>
            {open && open ? <DialogEdit handleReRender={handleReRender}/> : ''}
                    
        </div>
    );
}

export default ListUser;