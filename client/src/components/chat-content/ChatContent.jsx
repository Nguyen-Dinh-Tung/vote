import React, { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ApiBase, host } from '../../api/api.base';
import { Avatar } from '@mui/material';
import jwtDecode from 'jwt-decode';
function ChatContent(props) {
  const idRoomSelect = props.idRoomSelect;
  const [amount, setAmount] = useState(10);
  const [boxMessage, setBoxMessage] = useState([]);
  let token = jwtDecode(localStorage.getItem('token'));
  let idUserInit = token.idUser;
  useEffect(() => {
    const urlGetRoomData = `/rooms/data/${idRoomSelect}/${amount}`;
    ApiBase.get(urlGetRoomData)
      .then((res) => {
        console.log(res);
        setBoxMessage(res.data.data);
      })
      .catch((e) => {
        if (e) console.log(e);
      });
  }, [idRoomSelect]);
  return (
    <div className="chat-content">
      <div className="chat-body">
        <ul>
          {boxMessage &&
            boxMessage.map((e) => {
              return (
                <li
                  className="chat-message"
                  key={e.id}
                  style={{
                    display: 'flex',
                    justifyContent:
                      e && e.idUser !== idUserInit ? 'left' : 'right',
                  }}
                >
                  {e && e.idUser !== idUserInit ? (
                    <Avatar alt="Remy Sharp" src={e && host + e.background} />
                  ) : (
                    ''
                  )}
                  <p style={{}}>{e.message}</p>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="chat-bottom">
        <input
          type="text"
          className="search-chat"
          placeholder="Gõ vào tao đi "
        />
        <AttachFileIcon>
          <input type="file" />
        </AttachFileIcon>
        <SendIcon
          sx={{
            cursor: 'pointer',
            ':hover': {
              color: '#c89ff0',
            },
            fontSize: '30px',
          }}
        />
      </div>
    </div>
  );
}

export default ChatContent;
