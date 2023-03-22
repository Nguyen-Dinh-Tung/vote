import './index.css'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiBase, host } from '../../api/api.base';
import { FORBIDDEN } from '../../contants/notify/message';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR } from '../../contants/notify/type.notify';
import useNotifyFunc from '../../hooks/notify.func';
import SettingsIcon from '@mui/icons-material/Settings';
import { setDialogEdit } from '../../redux/features/show.slice';
import { setId } from '../../redux/features/id.slice';
import FormEditCandiate from '../form-edit-candidate/FormEditCandidate';
import { Box, FormControl, InputLabel, MenuItem, Pagination, Stack } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
function ListCandidate(props) {

    const urlGetListCandidate = `/candidate/1` ;
    const open = useSelector(state => state.show.dialogEdit) ;
    const dispatch = useDispatch()
    const [notifyFunc] = useNotifyFunc()  ;
    const [list , setList] = useState() ;
    const [render , setRerender] = useState()
    const [totalPage , setTotalPage] = useState(1)
    const [page , setPage] = useState(1)
    const [searchKey , setSearchKey] = useState() 
    const [filter , setFilter] = useState()
    const refSearch = React.useRef(null)

    const handleReRender = ()=>{
        setRerender(Date.now())
    }
    const setTing = () =>{
        dispatch(setDialogEdit(true))
    }
    const handleSelectId = (id)=>{
        dispatch(setId(id))
    }
    const handleChangePage = (e , page)=>{
        setPage(page)
    }
    const handChangeSearchKey = (e) =>{
        setFilter(undefined)
        let value = e.target.value ;
        if(value !== '')
        setPage(1)


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
    const handleChangeFilter = (event) =>{
        setFilter(event.target.value)
    }


    useEffect(() =>{

        let urlEntity = `/candidate/${page}` ;
    
        if(searchKey !== undefined && searchKey !== '')
        urlEntity += `?search=${searchKey}`
    
        if(filter !== undefined)
        urlEntity += `?isActive=${filter}`
        ApiBase.get(urlEntity)
        .then(res =>{
            let listCandidate = res.data.listCandidate.sort((a,b) =>{
                return Number(b.isActive) -  Number(a.isActive)
            })
            setList(listCandidate)
            setTotalPage(Math.ceil(res.data.total / 8))
        })
        .catch(e =>{
            if(e)
            notifyFunc(ERROR , e.response.data.message , TRUE)
        })

        const urlListCompany = '/'
        ApiBase.get()

    },[render , searchKey , filter , page])

    return (
        <div className='table-user'>
            <p className='header-list-user'>Quản lý thí sinh </p>
            <div className="filter">
            <input id='search' 
            type="text" name='search' 
            placeholder='Tìm tài khoản hoặc tên người dùng ...' 
            onChange={handChangeSearchKey}/>
            <select id='select-filter' onChange={handleChangeFilter} name="filter">
                <option selected={searchKey && searchKey ? true : false}>Lọc</option>
                <option value="true">Hoạt động</option>
                <option value="false">Ngừng</option>
            </select>
            </div>
        
            <table className='list-user'>
                <thead>
                <th>SBD</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Chiều cao</th>
                <th>Cân nặng</th>
                <th>Ba vòng</th>
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
                            <td>{e && e.idno}</td>
                            <td>{e && e.name}</td>
                            <td>{e && e.email}</td>
                            <td>{e && e.address}</td>
                            <td>{e && e.height}</td>
                            <td>{e && e.weight}</td>
                            <td>{e && e.measure}</td>
                            <td className='align-center'><img className='user-list-avatar' src={e &&host + e.background} alt="" /></td>
                            <td>{e && e.isActive == true ? "Hoạt động" : 'Dừng'}</td>
                            <td className='align-center cursor-pointer'><SettingsIcon color="secondary" onClick={() => {handleSelectId(e.id) ; setTing()}} sx={{fontSize : '30px'}}/></td>
                        </tr>
                    })
                    : ''}
                </tbody>
            </table>
            <div className="pagani-page">
                <Stack spacing={2}>
                    <Pagination page={ page && page} count={totalPage && totalPage} variant="outlined" color="primary" 
                    onChange={handleChangePage} />
                </Stack> 
            </div>
            {
                open && open ?
                <FormEditCandiate handleReRender={handleReRender}/> 
                : ''
            }
                    
        </div>
    );
}

export default ListCandidate;
