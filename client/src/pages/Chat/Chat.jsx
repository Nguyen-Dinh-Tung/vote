import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ApiBase } from '../../api/api.base';
import { socket } from '../../socket/socket';

function Chat(props) {

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [message , setMessage] = useState()
    const [input , setInput] = useState()
    const [selectUser , setSelectUser] = useState()
    const [listUser , setListUser] = useState()
    const [privateRoom , setPrivateRoom] = useState()
    const [boxMessage , setBoxMessage] = useState([])
    const [reRenderBoxMessage , setReRenderBoxMessage] = useState()
    let token = jwtDecode(localStorage.getItem('token'))
    let idUserInit = token.idUser
    
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
        const urlCreateRoomData = `/rooms-data/${privateRoom.id}`
        if(!selectUser.id)
        return 
        let data = {
            idUser : selectUser.id , 
            message : input ,
            file : undefined ,
            idRoom : privateRoom.id
        }
        socket.emit('private-chat' , data)

        ApiBase.post(urlCreateRoomData , data)
        .then(res =>{

            console.log(res);
            if(res.status === 201)
            setReRenderBoxMessage(Date.now())
        })
        .catch(e =>{

            if(e) console.log(e);

        })
    }
    socket.on('private-chat', (data) =>{
        if(privateRoom && data.roomId === privateRoom.id){
            setReRenderBoxMessage(Date.now())
        }
    })

    const handleGetRoom = (e) =>{
        setSelectUser(e)
        let idsGetRoom = {
            idUser : idUserInit , 
            idConnect : e.id
        }
        const urlGetRoom ='/rooms'
        ApiBase.post(urlGetRoom , idsGetRoom)
        .then(res =>{
            if(res.status === 200 || res.status === 201)
            setPrivateRoom(res.data.room)
            setReRenderBoxMessage(Date.now())

        })
        .catch(e =>{
            if(e){

                console.log(e);
            }
        })
    }

    useEffect(() =>{
        const urlEntity = '/users/1'
        ApiBase.get(urlEntity)
        .then(res => {
            setListUser(res.data.listUser)
        })

    }, [privateRoom])

    useEffect(() =>{
        if(privateRoom){
            const urlGetDataRoom = `/rooms/data/${privateRoom.id}`
            ApiBase.get(urlGetDataRoom)
            .then(res =>{
                console.log(res);
                setBoxMessage(res.data.data)
            })
            .catch(e =>{

                if(e) console.log(e);

            })
        }
    }, [ reRenderBoxMessage])
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
                    {e && e.id === idUserInit ? '' :
                    
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
                        handleGetRoom(e)
                    }}
                    >{e.username}</p>
                    }
                </>
            })}
            {selectUser && selectUser.username}
            <p>{isConnected && isConnected ? 'Online' : 'Off'}</p>

            <div className="box-message">
                {boxMessage && boxMessage.map((e) =>{
                    return <>
                    <p key={e.id}>{e && e.user.username} : {e && e.message}</p>
                    </>
                })}
            </div>
        </div>
    );
}

export default Chat;