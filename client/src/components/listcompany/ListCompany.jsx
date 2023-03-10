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
import { Box, Checkbox, Pagination, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack } from '@mui/material';
import Loadding from '../loadding/Loadding';
import FormEditCompany from '../form-edit-company/FormEditCompany';
import { Outlet, useNavigate } from 'react-router';
import { styled } from '@mui/material/styles';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { SUCCESS } from '../../contants/notify/type.notify';
import { LIST_NOT_DATA } from '../../contants/notify/message';
import DialogShareCompany from '../sharecp/DialogShareCompany';
const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute', 
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  }));
  const actions = [
    { icon: <DeleteIcon  />, name: 'Xóa cuộc thi',actions : 'delete' },
    { icon: <ShareIcon />, name: 'Chia sẻ quyền quản lý tổ chức',actions : 'share' },
    { icon: <CloudDownloadIcon />, name: 'Thêm cuộc thi vào danh sách quản lý',actions : 'add-new-contest' },
    { icon: <CloudOffIcon />, name: 'Quản lý cuộc thi cũ',actions : 'old-contest' },

    ];
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
    const [listCheck , setListCheck] = useState([])
    const refSearch = useRef(null)
    const [confim , setConfim] = useState()
    const [hidden, setHidden] = React.useState(false);
    const [direction, setDirection] = React.useState('up');
    const [show , setShow] = useState()
    const navigate = useNavigate()
    const setTing = () =>{
        dispatch(setDialogEdit(true))
    }
    const handleSelectId = (id)=>{
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
    const handleChecked = (e, id) =>{
        let checked = e.target.checked ;
        if(e.target.name === 'all'){
            let allCheck = []
            if(checked === true){
                for(let element of listUser){
                    allCheck.push(element.id)
                }
                setListCheck(allCheck)
            }else{
                setListCheck([])
            }
        }else{

            if(checked == true && !listCheck.includes(id)){
                listCheck.push(id)
                setListCheck([...listCheck])
            }
            if(checked == false && listCheck.includes(id)){
                listCheck.splice(listCheck.indexOf(id) , 1)
                setListCheck([...listCheck])
            }
        }
        
    }

    const submitDelete = ()=>{
        // const urlRemoveAscp = `/assignment-company/${id && id}`
        // ApiBase.post(urlRemoveAscp , listCheck)
        // .then(res =>{
        //     if(res.status === 200){
        //         notifyFunc(SUCCESS , res.data.message , TRUE)
        //         handleRerender()
        //     }
        // })
        // .catch(e =>{

        //     if(e) {
        //         notifyFunc(ERROR , e.response.data.message , TRUE)
        //     }
        // })
    }

    const submitShare = () =>{

        setShow(true)

    }


    const handleClickIcon = (action) =>{
        let actions = action.actions ;

        if(listCheck.length < 1){
            notifyFunc(ERROR , LIST_NOT_DATA , TRUE)
            return
        }

        if(actions === 'delete'){

            setConfim({
                message : "Bạn có đồng ý xóa ?" ,
                status : true ,
                handle : submitDelete
            })

        }

        if(actions === 'share'){
            setConfim({
                message : "Chia sẻ quản lý cuộc thi ?" ,
                status : true ,
                handle : submitShare,
                name : 'share'
            })
        }

        if(actions === 'save'){
            setConfim({
                message : "Bạn có đồng ý xóa" ,
                status : true
            })

        }
    }

    const handleCloseDialogShare = () =>{
        setConfim(undefined)
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

            <p className='header-list-user'>Danh sách tổ chức</p>
            
            <div className="header-page" >

            <input id='search' type="text" name='search' placeholder='Tìm tài khoản hoặc tên người dùng ...' onChange={handChangeSearchKey}/>
            <select id='select-filter' onChange={handleChangeFilter} name="filter">
                <option selected={searchKey && searchKey ? true : false}>Lọc</option>
                <option value={'ucp'}>Tổ chức của tôi</option>
                <option value="true">Hoạt động</option>
                <option value="false">Ngừng</option>
            </select>
            </div>
            {!listUser ? <Loadding/> : 
                <>
            <table className='list-user'>
            <thead>
            <th>
            <Checkbox name='all' onChange={(event) =>{
            handleChecked( event)
            }} color="secondary" />
            </th>
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
                    <td style={{textAlign : 'center'}}>
                    <Checkbox onChange={(event) =>{
                        handleChecked( event,e.id)
                    }} color="secondary" 
                    checked={listCheck && 
                    listCheck.includes(e.id) 
                    ? true : false}/>
                    </td>
                    
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
                <Box style={{position : 'absolute' , bottom : '10%' , right : '2%'}} >
                        <StyledSpeedDial
                        ariaLabel="SpeedDial playground example"
                        hidden={hidden}
                        icon={<SpeedDialIcon />}
                        direction={direction}
                        >
                        {actions.map((action) => (
                            <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() =>{
                                handleClickIcon(action)
                            }}
                            describeChild={true}
                            />
                        ))}
                        </StyledSpeedDial>
                    </Box>
                </>
            }
            {open && open ? <FormEditCompany handleReRender={handleRerender}/> : ''}
            
            
            {confim && confim.name === "share" ? 
            <DialogShareCompany 
            listIdCompany={listCheck}
            handleClose={handleCloseDialogShare} 
            open={confim && confim.name == "share" ? true : false}/>:''}
            
        </div>
    );
}

export default ListCompany;