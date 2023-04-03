import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ApiBase } from '../../api/api.base';
import { socket } from '../../socket/socket';

function Chat(props) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [input, setInput] = useState();
  const [selectUser, setSelectUser] = useState();
  const [listUser, setListUser] = useState([]);
  const [privateRoom, setPrivateRoom] = useState();
  const [boxMessage, setBoxMessage] = useState([]);
  const [reRenderBoxMessage, setReRenderBoxMessage] = useState();
  const [listCheck, setListCheck] = useState([]);
  let token = jwtDecode(localStorage.getItem('token'));
  let idUserInit = token.idUser;

  const connect = () => {
    setIsConnected(true);
    socket.connect().on('online');
  };

  const disConnect = () => {
    setIsConnected(false);
    socket.disconnect();
  };

  const handleChangeInput = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (!selectUser.id) return;
    if (!privateRoom) return;

    let data = {
      idUser: idUserInit,
      message: input,
      file: undefined,
      idRoom: privateRoom.id,
    };
    socket.emit('private-chat', data);
  };

  const handleJoinRoom = async (e) => {
    setSelectUser(e);
    let joinRoomData = {
      idUser: idUserInit,
      idConnect: e.id,
    };
    const urlGetRoom = '/rooms';
    ApiBase.post(urlGetRoom, joinRoomData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setPrivateRoom(res.data.room);
          setReRenderBoxMessage(Date.now());
        }
      })
      .catch((e) => {
        if (e) {
          console.log(e);
        }
      });
  };

  const handleCreateGroupChat = () => {
    console.log(listCheck);
  };

  const handleCheck = (e, id) => {
    let name = e.target.name;
    let checked = e.target.checked;

    if (name === 'all') {
      if (checked) {
        let listChecked = [];
        for (let e of listUser) {
          listChecked.push(e.id);
        }
        setListCheck([...listChecked]);
      } else {
        setListCheck([]);
      }
    } else {
      if (checked) {
        if (!listCheck.includes(e.target.value)) {
          listCheck.push(e.target.value);
          setListCheck([...listCheck]);
        }
      } else {
        listCheck.splice(listCheck.indexOf(e.target.value), 1);
        setListCheck([...listCheck]);
      }
    }
  };

  useEffect(() => {
    const urlEntity = '/users/1';
    ApiBase.get(urlEntity)
      .then((res) => {
        setListUser(res.data.listUser);
      })
      .catch((e) => {
        if (e) console.log(e);
      });
  }, []);

  useEffect(() => {
    const urlGetGroupChats = '/rooms/group-chat/' + idUserInit;
    ApiBase.get(urlGetGroupChats)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        if (e) console.log(e);
      });
  }, []);
  useEffect(() => {
    if (privateRoom) {
      const urlGetDataRoom = `/rooms/data/${privateRoom.id}`;
      ApiBase.get(urlGetDataRoom)
        .then((res) => {
          let data = res.data.data.sort((a, b) => {
            return new Date(a.timeAt) - new Date(b.timeAt);
          });
          setBoxMessage(data);
        })
        .catch((e) => {
          if (e) console.log(e);
        });
    }
  }, [reRenderBoxMessage]);
  useEffect(() => {
    socket.on('reveice-private-chat', (data) => {
      setReRenderBoxMessage(Date.now());
    });
  }, [privateRoom]);
  return (
    <div>
      <div>
        <button
          style={{
            width: '200px',
            height: '40px',
          }}
          onClick={connect}
        >
          Connect
        </button>

        <button
          style={{
            width: '200px',
            height: '40px',
          }}
          onClick={disConnect}
        >
          Disconnect
        </button>

        <input
          type="text"
          name="input"
          value={input}
          onChange={handleChangeInput}
        />
        <button
          style={{
            width: '200px',
            height: '40px',
          }}
          onClick={handleSend}
        >
          Gửi
        </button>
        <button
          style={{
            width: '200px',
            height: '40px',
          }}
          onClick={handleCreateGroupChat}
        >
          Tạo phòng
        </button>
        <input
          type="checkbox"
          name="all"
          onChange={(e) => {
            handleCheck(e, -1);
          }}
        />
      </div>
      {listUser &&
        listUser.map((e, index) => {
          return (
            <>
              {e && e.id === idUserInit ? (
                ''
              ) : (
                <p
                  style={{
                    background: 'green',
                    display: 'block',
                    width: '200px',
                    height: '40px',
                    textAlign: 'center',
                    color: 'white',
                    borderRadius: '4px',
                  }}
                  onClick={() => {
                    handleJoinRoom(e);
                  }}
                >
                  {e.username}
                </p>
              )}
              <input
                type="checkbox"
                name="single"
                onChange={(e) => {
                  handleCheck(e, e.id);
                }}
                value={e.id}
                checked={listCheck.includes(e.id) ? true : false}
              />
            </>
          );
        })}
      {selectUser && selectUser.username}
      <p>{isConnected && isConnected ? 'Online' : 'Off'}</p>

      <div className="box-message">
        {boxMessage &&
          boxMessage.map((e) => {
            return (
              <>
                <p key={e.id}>
                  {e && e.user.username} : {e && e.message}
                </p>
              </>
            );
          })}
      </div>
    </div>
  );
}

export default Chat;
