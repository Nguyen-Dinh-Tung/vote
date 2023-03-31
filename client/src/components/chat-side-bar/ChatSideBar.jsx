import { Avatar } from '@mui/material';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ApiBase, host } from '../../api/api.base';
import './index.css'

function ChatSideBar(props) {
    const [listRooms , setListRooms] = useState()
    let token = jwtDecode(localStorage.getItem('token')) ;
    let idUserInit = token.idUser
    const setIdRoomSelect = props.setIdRoomSelect
    const handleSelectRoomChat = (id) =>{
        setIdRoomSelect(id)
    }
    useEffect(() =>{
        const urlGetUsers = `/rooms/${idUserInit}`
        ApiBase.get(urlGetUsers)
        .then(res =>{
            setListRooms(res.data.rooms)
        })
        .catch(e =>{

            if(e) console.log(e);

        })

    },[])

    useEffect(() => {
        const urlGetListUser = `/users/1`
        ApiBase.get(urlGetListUser)
        .then(res =>{
            console.log(res);
        })
        .catch(e =>{

            if(e) console.log(e);
            
        })
    } , [])
    return (
        <div style={{
            width : '26%' ,
            height : '100%' ,
            backgroundColor : '#c89ff0',
            display : 'flex' ,
            flexDirection : 'column' ,
            alignItems : 'center' ,
            flex : 0.8
}}>
            <input type="text" name="search" 
            className='search-chat'
            placeholder='Nhập tên tài khoản' />

            <div className="list-user-chat">
                <ul className='chat-list'>
                {
                    listRooms && listRooms.map((e) =>{
                        return <li className='chat-element' key={e.idRoom} onClick={() =>{
                            handleSelectRoomChat(e.idRoom)
                        }}>
                            <Avatar alt="Remy Sharp" src={e && host + e.background} />
                            <p className='chat-username'>{e && e.username}</p>
                        </li>
                    })
                }
                </ul>
            </div>
        </div>
    );
}

export default ChatSideBar;