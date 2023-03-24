import React, { useEffect, useState } from 'react';
import { ApiBase } from '../../api/api.base';
import SocketIo from '../../components/socket/SocketIo';
import { socket } from '../../socket/socket';

function Chat(props) {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [message , setMessage] = useState()
    const [input , setInput] = useState()
    const [selectUser , setSelectUser] = useState()
    const connect = () =>{
        setIsConnected(true)
        socket.connect().on('online')
    }
    const disConnect = () =>{
        setIsConnected(false)
        socket.disconnect()
    }

    const handleChangeInput = (e) =>{
        setInput(e.target.value)
    }
    const handleSend = () => {
        if(!selectUser.id)
        return 
        let data = {
            idUser : selectUser.id , 
            message : input
        }
        socket.emit('chat' , data).on('chat', (data) =>{
            setMessage(data)
        })
    }
    const handleChat = (e) =>{
        setSelectUser(e)
    }
    const [listUser , setListUser] = useState()
    useEffect(() =>{
        const urlEntity = '/users/1'
        ApiBase.get(urlEntity)
        .then(res => {
            console.log(res);
            setListUser(res.data.listUser)
        })
    }, [])
    return (
        <div>
            <div>
            <button style={{
                width: '200px',
                height: '40px'
            }}
            onClick={connect}
            >Connect</button>

            <button style={{
                width: '200px',
                height: '40px'
            }}
            onClick={disConnect}
            >Disconnect</button>

            <input type="text" name='input' value={input} onChange={handleChangeInput} />
            <button style={{
                width: '200px',
                height: '40px'
            }}
            onClick={handleSend}
            >
                Gửi
            </button>

            <p>{message && message}</p>
        </div>
            {listUser && listUser.map((e,index) =>{
                return <>
                    <p 
                    style={{
                        background : 'green' ,
                        display : 'block' ,
                        width : '200px' ,
                        height : '40px' ,
                        textAlign : 'center' , 
                        color : 'white',
                        borderRadius : '4px'
                    }}
                    onClick={() =>{
                        handleChat(e)
                    }}
                    >{e.username}</p>
                </>
            })}
            {selectUser && selectUser.username}
        </div>
    );
}

export default Chat;