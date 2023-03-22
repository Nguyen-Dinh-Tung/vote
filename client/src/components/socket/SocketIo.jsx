import React, { useEffect, useState } from 'react';
import { socket } from '../../socket/socket';
function SocketIo(props) {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() =>{
        const connect = () =>{
            setIsConnected(true)
            console.log(1);
        }
        const disConnect = () =>{
            setIsConnected(false)
        }
        const event = () =>{

        }
        socket.on('connect', connect )
        socket.on('disconnect', disConnect )
        socket.on('events', event )
    },[])

    console.log(isConnected);
    return (
        <div>
            
        </div>
    );
}

export default SocketIo;