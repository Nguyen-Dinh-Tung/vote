import React, { useEffect, useState } from 'react';
import { socket } from '../../socket/socket';
function SocketIo(props) {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const connect = () =>{
        setIsConnected(true)
        socket.connect()
    }
    const disConnect = () =>{
        setIsConnected(false)
        socket.disconnect()
    }
    useEffect(() =>{
        socket.on('connected' , (data) => console.log(data))
    },[isConnected])

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
        </div>
    );
}

export default SocketIo;