import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { socket } from '../../socket/socket';

function Sse(props) {

    const [isConnected , setIsConnected] = useState(socket.connected)
    const [fooEvents , setFooEvents]= useState()


    useEffect(() =>{
        let token = jwtDecode(localStorage.getItem('token'))
        let id = token.idUser
        function onConnect() {
            setIsConnected(true);
          }
      
          function onDisconnect() {
            setIsConnected(false);
          }
      
          function onFooEvent(value) {
            setFooEvents(previous => [...previous, value]);
          }
      
          socket.on('connect', onConnect);
          socket.on('disconnect', onDisconnect);
          socket.on('foo', onFooEvent);
      
          return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('foo', onFooEvent);
          };
    },[])
    return (
        <div>
            {fooEvents}
            <p>{isConnected}</p>
        </div>
    );
}

export default Sse;