import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiBase, host } from '../../api/api.base';
import { FORBIDDEN } from '../../contants/notify/message';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR } from '../../contants/notify/type.notify';
import useNotifyFunc from '../../hooks/notify.func';
import './index.css'
import SettingsIcon from '@mui/icons-material/Settings';
import { setDialogEdit } from '../../redux/features/show.slice';
import { setId } from '../../redux/features/id.slice';
import Dialog from '../dialog/DialogControler';
import DialogControler from '../dialog/DialogControler';
import FormEditContest from '../form-edit-contest/FormEditContest';
function ListContest(props) {

    const urlGetListContest = `/contest` ;
    const open = useSelector(state => state.show.dialogEdit) ;
    const dispatch = useDispatch()
    const [notifyFunc] = useNotifyFunc()  ;
    const [list , setList] = useState() ;
    const [contest , setContest] = useState() ;
    const [render , setRerender] = useState()

    const handleReRender = ()=>{
        setRerender(Date.now())
    }
    const setTing = () =>{
        dispatch(setDialogEdit(true))
    }
    const handleSelectId = (id)=>{
        dispatch(setId(id))
    }

    useEffect(() =>{
        ApiBase.get(urlGetListContest)
        .then(res =>{
            console.log(res , 'res list conets');
            let listContest = res.data.listContest.sort((a,b) =>{
                return Number(b.isActive) -  Number(a.isActive)
            })
            setList(listContest)
        })
        .catch(e =>{
            if(e.response.status == 403)
            notifyFunc(ERROR , FORBIDDEN , TRUE)
        })
    },[render])

    return (
        <div className='table-user'>
            <p className='header-list-user'>Danh sách cuộc thi </p>
            <table className='list-user'>
                <thead>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Tổ chức</th>
                <th>Avatar</th>
                <th>Trạng thái</th>
                <th>Tùy chỉnh</th>
                </thead>
                <tbody>
                    {list && list.length >0 ? 
                    list.map((e , index) =>{
                        return <tr className='tr-list-user' 
                        style={{
                            backgroundColor : e && e.isActive ? '' : "#374151",
                            color : e && e.isActive ? '' : "white"
                        }}
                        >
                            <td>{e && e.name}</td>
                            <td>{e && e.email}</td>
                            <td>{e && e.address}</td>
                            <td>{e && e.company}</td>
                            <td className='align-center'><img className='user-list-avatar' src={e &&host + e.background} alt="" /></td>
                            <td>{e && e.isActive == true ? "Hoạt động" : 'Dừng'}</td>
                            <td className='align-center cursor-pointer'><SettingsIcon color="secondary" onClick={() => {handleSelectId(e.id) ; setTing()}} sx={{fontSize : '30px'}}/></td>
                        </tr>
                    })
                    : ''}
                </tbody>
            </table>
            {open && open ? <FormEditContest handleReRender={handleReRender}/> : ''}
                    
        </div>
    );
}

export default ListContest;