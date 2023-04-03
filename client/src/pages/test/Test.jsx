import React, { useEffect, useState } from 'react';
import ChatContent from '../../components/chat-content/ChatContent';
import ChatSideBar from '../../components/chat-side-bar/ChatSideBar';
import { socket } from '../../socket/socket';
import UserShare from '../../components/co-share/UserShare';

function Test(props) {
  const [idRoomSelect, setIdRoomSelect] = useState();
  useEffect(() => {
    socket.connect().on('online');
  }, []);
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
      }}
    >
      <ChatSideBar setIdRoomSelect={setIdRoomSelect} />
      <ChatContent idRoomSelect={idRoomSelect && idRoomSelect} />
    </div>
  );
}

export default Test;
