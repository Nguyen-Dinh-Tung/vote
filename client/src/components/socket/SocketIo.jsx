import React, { useEffect, useState } from 'react';
import { socket } from '../../socket/socket';


function SocketIo(props) {
    
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [message , setMessage] = useState()
    const [input , setInput] = useState()
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
    const handleSend = () =>{
        let data = {
            idUser : "8cb4286b-0a29-48da-9f54-920246cafc11" , 
            message : input
        }
        socket.emit('chat' , data).on('chat', (data) =>{
            setMessage(data)
        })
    }

    useEffect(() =>{
        socket.on('connected' , (data) => console.log(data))
        socket.on('chat' , (data) =>{
            console.log(data);
        })
    },[])

    return (
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
    );
}

export default SocketIo;