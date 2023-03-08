import React, { useState } from 'react';
import { Button, Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination } from '@mui/material';
import { Stack } from '@mui/system';
import { ApiBase, host } from '../../api/api.base';
import useNotifyFunc from '../../hooks/notify.func';
import { ERROR } from '../../contants/notify/type.notify';
import { TRUE } from '../../contants/notify/status.notify';
import { Avatar } from '@mui/material'; 
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function CompanyShare(props) {


    const [page , setPage] = useState(1)
    const [totalPage , setTotalPage] = useState(1)
    const [searchKey , setSearchKey] = React.useState() 
    const refSearch = React.useRef(null)
    const [listUser , setListUser] = React.useState()
    const [listSelectDemo , setListSelectDemo] = useState([])
    const [totalDemoPage , setTotalDemoPage] = useState(1)
    const [demoPage , setDemoPage] = useState(1)
    const handleGetData = props.handleGetData ;
    const [checked, setChecked] = React.useState([]);


    const [notifyFunc] = useNotifyFunc()





    const handleChangeDemoPage = (e , page) =>{
        setDemoPage(page)
    }
    const handleRemoveSelectDemo = (id) =>{
        listSelectDemo.map((e , index)=>{
            if(e.id === id){
                listSelectDemo.splice(index,1)
                checked.splice(index,1)
            }
    
        })
        setListSelectDemo([...listSelectDemo])
        setChecked([...checked])
        setTotalDemoPage(Math.ceil(listSelectDemo.length / 8))
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

      const handleChangePage = (e , page)=>{
        setPage(page)
    }
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value.id);
        const newChecked = [...checked];
        const listDemo = [...listSelectDemo]
        if (currentIndex === -1) {
    
            if(!newChecked.includes(value.id)){
                newChecked.push(value.id);
                listDemo.push(value)
            }
            
        } else {
          newChecked.splice(currentIndex, 1);
          listDemo.splice(currentIndex,1)
        }
        handleGetData(newChecked)
        setChecked(newChecked);
        setTotalDemoPage(Math.ceil(listDemo.length /8))
        setListSelectDemo(listDemo)
      };

      
    React.useEffect(() =>{
        let urlEntity = `/company/${page}` ;
        
        if(searchKey !== undefined && searchKey !== '')
        urlEntity += `?search=${searchKey}`
    
        ApiBase.get(urlEntity)
        .then(res =>{
            console.log(res);
            setListUser(res.data.listCompany)
            setTotalPage(Math.ceil(res.data.total / 8))
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
            <div className="box-demo">
                        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' , display : 'flex' , flexDirection : 'column' , alignItems : 'center' }}>
                            <p className='header-select'>Danh sách thí sinh</p>
                            <input id='search' 
                            type="text" name='search' 
                            placeholder='Tìm tài khoản hoặc tên người dùng ...' 
                            onChange={handChangeSearchKey}/>
                                {listUser && listUser.map((e) => {
                                return (
                                    <ListItem
                                    key={e &&e.id}
                                    secondaryAction={
                                        <Checkbox
                                        edge="end"
                                        onChange={handleToggle(e && e)}
                                        checked={checked.includes(e &&e.id) }
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
                                        <ListItemText id={e && e.id} primary={` ${e && e.descs} - ${e && e.name}`} />
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
                        <div className="box-selected">
                        <p>Danh share</p>
                            {listSelectDemo && listSelectDemo.map((e,index) =>{
                                let limit =8 ;
                                let offset = demoPage * limit - limit 
                                if(index >= offset && index < demoPage * limit)
                                 return<div className="task-demo">
                                 <Avatar
                                 alt="Remy Sharp"
                                 src={e && host + e.background}
                                 />
                                 <p>{e && e.name}</p>
                                 <HighlightOffIcon onClick={() =>{
                                     handleRemoveSelectDemo(e.id)
                                 }}/>
                                 </div>
                                
                            })}
 
                            <div className="pagani-page">
                                <Stack spacing={2}>
                                    <Pagination count={totalDemoPage && totalDemoPage} variant="outlined" color="primary" onChange={handleChangeDemoPage} />
                                </Stack> 
                            </div>
                        </div>
                    </div>
    );
}

export default CompanyShare;