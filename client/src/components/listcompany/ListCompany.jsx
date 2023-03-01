import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiBase, host } from '../../api/api.base';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR, WARNING } from '../../contants/notify/type.notify';
import useNotifyFunc from '../../hooks/notify.func';
import './index.css'
import SettingsIcon from '@mui/icons-material/Settings';
import { setDialogEdit } from '../../redux/features/show.slice';
import { setId } from '../../redux/features/id.slice';
import DialogEdit from '../dialoguser/DialogEdit';
import { Pagination, Stack } from '@mui/material';
import Loadding from '../loadding/Loadding';
import FormEditCompany from '../form-edit-company/FormEditCompany';
import { Outlet, useNavigate } from 'react-router';

function ListCompany(props) {

    const open = useSelector(state => state.show.dialogEdit) ;
    const dispatch = useDispatch()
    const [notifyFunc] = useNotifyFunc() 
    const [listUser , setListUser] = useState()
    const [searchKey , setSearchKey] = useState() 
    const [filter , setFilter] = useState()
    const [page , setPage] = useState(1)
    const [totalPage , setTotalPage] = useState(1)
    const [reRender , setReRender] = useState()
    const refSearch = useRef(null)
    const navigate = useNavigate()
    const setTing = () =>{
        dispatch(setDialogEdit(true))
    }
    const handleSelectId = (id)=>{
        console.log(id, 'id');
        dispatch(setId(id))
    }
    const handleRerender = () =>{
        setReRender(Date.now())
    }
    const handChangeSearchKey = (e) =>{
        setFilter(undefined)
        if(!searchKey)
        setPage(1)

        let value = e.target.value ;

        if(refSearch.current)
        clearTimeout(refSearch.current)

        refSearch.current = setTimeout(() =>{

            if(searchKey != ''){

                setSearchKey(value)

            }else{

                setSearchKey('')

            }
        },1000)



    }

    const handleChangePage = (e , page)=>{
        setPage(page)
    }
    const handleChangeFilter = (e) =>{
        setSearchKey(undefined) 
        setPage(1)
        setFilter(e.target.value)
    }

    const showContestList = (id) =>{

        navigate('/assm-company/' + id)
        
    }

    useEffect(() =>{
    let urlEntity = `/company/${page}` ;
    
    if(searchKey !== undefined && searchKey !== '')
    urlEntity += `?search=${searchKey}`

    if(filter !== undefined)
    urlEntity += `?isActive=${filter}`
    
    ApiBase.get(urlEntity)
        .then(res =>{
            if(res.status === 200){
                setListUser(res.data.listCompany)
                setTotalPage(Math.ceil(res.data.total / 8))
            }
        })
        .catch(e =>{
            if(e){
                console.log(e , 'e');
            notifyFunc(ERROR , e.response.data.message , TRUE)
            }
        })

    },[reRender , searchKey ,page , filter])


    return (
        <div className='table-user'>


            
            <p className='header-list-user'>Quản lý tài khoản</p>
            
            <div className="header-page" >

            <input id='search' type="text" name='search' placeholder='Tìm tài khoản hoặc tên người dùng ...' onChange={handChangeSearchKey}/>
            <select id='select-filter' onChange={handleChangeFilter} name="filter">
                <option selected={searchKey && searchKey ? true : false}>Trạng thái</option>
                <option value="true">Hoạt động</option>
                <option value="false">Ngừng</option>
            </select>
            </div>
            {!listUser ? <Loadding/> : 
                <>
            <table className='list-user'>
            <thead>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Lĩnh vực</th>
            <th>Avatar</th>
            <th>Trạng thái</th>
            <th>Tùy chỉnh</th>
            </thead>
            <tbody>
            {listUser && listUser.length >0 ? 
            
            listUser.map((e , index) =>{
                return <tr className='tr-list-user' key={e.id} 
                    style={{
                        backgroundColor : e && e.isActive ? '' : "#374151",
                        color : e && e.isActive ? '' : "white"
                    }}
                    >
                    <td onClick={() =>{
                        showContestList(e.id)
                    }}>{e && e.name}</td>
                    <td onClick={() =>{
                        showContestList(e.id)
                    }}>{e && e.email}</td>
                    <td onClick={() =>{
                        showContestList(e.id)
                    }}>{e && e.address}</td>
                    <td onClick={() =>{
                        showContestList(e.id)
                    }}>{e && e.bss}</td>
                    <td  onClick={() =>{
                        showContestList(e.id)
                    }}className='align-center'><img className='user-list-avatar' src={e &&host + e.background} alt="" /></td>
                    <td onClick={() =>{
                        showContestList(e.id)
                    }}>{e && e.isActive == true ? "Hoạt động" : 'Dừng'}</td>
                    <td className='align-center cursor-pointer'><SettingsIcon color="secondary" onClick={() => {handleSelectId(e.id) ; setTing()}} sx={{fontSize : '30px'}}/></td>
                </tr>
            })
            : ''}
                </tbody>
                </table>
                <div className="pagani-page">
                <Stack spacing={2}>
                    <Pagination count={totalPage && totalPage} variant="outlined" color="primary" onChange={handleChangePage} />
                </Stack> 
                </div>
                </>
            }
            
            {open && open ? <FormEditCompany handleReRender={handleRerender}/> : ''}
            
            
            
        </div>
    );
}

export default ListCompany;