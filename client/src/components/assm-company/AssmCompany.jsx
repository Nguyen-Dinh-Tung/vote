import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiBase, host } from '../../api/api.base';
import { TRUE } from '../../contants/notify/status.notify';
import { ERROR, SUCCESS, WARNING } from '../../contants/notify/type.notify';
import useNotifyFunc from '../../hooks/notify.func';
import { setDialogEdit } from '../../redux/features/show.slice';
import { setId } from '../../redux/features/id.slice';
import { Checkbox, Pagination, Stack } from '@mui/material';
import Loadding from '../loadding/Loadding';
import FormEditCompany from '../form-edit-company/FormEditCompany';
import {  useNavigate, useParams } from 'react-router';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import Confim from '../confim/Confim';
import { LIST_NOT_DATA } from '../../contants/notify/message';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import DialogShareCompany from '../sharecp/DialogShareCompany';
import { all } from 'axios';


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
    { icon: <ShareIcon />, name: 'Chia sẻ quyền quản lý cuộc thi',actions : 'share' },
    { icon: <CloudDownloadIcon />, name: 'Thêm cuộc thi vào danh sách quản lý',actions : 'add-new-contest' },
    { icon: <CloudOffIcon />, name: 'Quản lý cuộc thi cũ',actions : 'old-contest' },

    ];


function AssmCompany(props) {

    const open = useSelector(state => state.show.dialogEdit) ;
    const dispatch = useDispatch()
    const [notifyFunc] = useNotifyFunc() 
    const [list , setList] = useState()
    const [searchKey , setSearchKey] = useState() 
    const [filter , setFilter] = useState()
    const [page , setPage] = useState(1)
    const [totalPage , setTotalPage] = useState(1)
    const [reRender , setReRender] = useState()
    const refSearch = useRef(null)
    const navigate = useNavigate()
    const [hidden, setHidden] = React.useState(false);
    const [direction, setDirection] = React.useState('up');
    const [listCheck , setListCheck] = useState([])
    const [confim , setConfim] = useState()
    const param = useParams()
    let id = param.id

    const submitDelete = ()=>{
        const urlRemoveAscp = `/assignment-company/${id && id}`
        ApiBase.post(urlRemoveAscp , listCheck)
        .then(res =>{
            if(res.status === 200){
                notifyFunc(SUCCESS , res.data.message , TRUE)
                handleRerender()
            }
        })
        .catch(e =>{

            if(e) {
                notifyFunc(ERROR , e.response.data.message , TRUE)
            }
        })
    }

    const submitShare = () =>{
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
                name : 'share' ,
                handle : submitShare

            })

        }

        if(actions === 'save'){
            setConfim({
                message : "Bạn có đồng ý xóa" ,
                status : true
            })

        }
    }
    
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

    const backRouter = () =>{
        navigate('/companies')
    }


    const handleChecked = (e,id) =>{
        let checked = e.target.checked ;
        let name = e.target.name 
        if(name && name === 'all'){
            if(checked){
                let allId = [] ;
                for(let e of list){
                    allId.push(e.id)
                }
                setListCheck(allId)
            return
            }
            setListCheck([])
            return
            
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
    const handleClose = () =>{
        setConfim({
            message : '' ,
            statu : false
        })
    }

    useEffect(() =>{

    let urlEntity = `/assignment-company/${id}/${page}` ;
    
    if(searchKey !== undefined && searchKey !== '')
    urlEntity += `?search=${searchKey}`

    if(filter !== undefined)
    urlEntity += `?isActive=${filter}`

    ApiBase.get(urlEntity)
        .then(res =>{
            if(res.status === 200){

                setList(res.data.listContest)
                setTotalPage(Math.ceil(res.data.total / 8))
            }
        })
        .catch(e =>{
            if(e){

                notifyFunc(ERROR , e.response.data.message , TRUE)

            }
        })

    },[reRender , searchKey ,page , filter])

    return (
        <div className='table-user'>
            <p className='header-list-user'>Quản lý cuộc thi</p>
            
            <div className="header-page" >
            <ArrowLeftIcon
            sx={{ 
            "&:hover": {
                cursor : 'pointer' ,
                backgroundColor : 'rgb(7, 177, 77, 0.42)'}}} 
                fontSize='large' onClick={backRouter}>
            </ArrowLeftIcon>
            <input id='search' type="text" name='search' placeholder='Tìm tên cuộc thi ...' onChange={handChangeSearchKey}/>
            <select id='select-filter' onChange={handleChangeFilter} name="filter">
                <option selected={searchKey && searchKey ? true : false}>Trạng thái</option>
                <option value="true">Hoạt động</option>
                <option value="false">Ngừng</option>
            </select>
            </div>
            {!list ? <Loadding/> : 
                <>
            <table className='list-user'>
            <thead>
            <th>
            <Checkbox name='all' onChange={(event) =>{
                        handleChecked( event ,'all')
                    }} color="secondary" 
            />
            </th>
            <th>Tên cuộc thi</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Tổ chức</th>
            <th>Avatar</th>
            <th>Trạng thái</th>
            </thead>
            <tbody>
            {list && list.length >0 ? 
            
            list.map((e , index) =>{
                return <>
                <tr className='tr-list-user' key={e.id} 
                    style={{
                        backgroundColor : e && e.isActive ? '' : "#374151",
                        color : e && e.isActive ? '' : "white"
                    }}
                    >
                    <td style={{
                        textAlign : 'center'
                    }}>
                    <Checkbox name='element' onChange={(event) =>{
                        handleChecked( event,e.id)
                    }} color="secondary" 
                    checked={listCheck && listCheck.includes(e.id)}
                    
                    />
                    </td>
                    <td>{e && e.name}</td>
                    <td>{e && e.email}</td>
                    <td>{e && e.address}</td>
                    <td>{e && e.company}</td>
                    <td className='align-center'>
                    <img className='user-list-avatar' src={e &&host + e.background} alt="" />
                    </td>
                    <td>{e && e.isActive == true ? "Hoạt động" : 'Dừng'}</td>
                </tr>
                    </>
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
                        </StyledSpeedDial >
                    </Box>
            {open && open ? <FormEditCompany handleReRender={handleRerender} /> : ''}
            {confim && confim.name === 'share' ? <DialogShareCompany listIdContest={listCheck} handleClose={handleClose} open={confim && confim.status}/> : ''}

        </div>
    );
}

export default AssmCompany;