import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ApiBase, host } from '../../api/api.base';
import { Avatar } from '@mui/material';
import './index.css';
import jwtDecode from 'jwt-decode';
import { socket } from '../../socket/socket';
import { useDispatch, useSelector } from 'react-redux';
import UserShare from '../co-share/UserShare';
import useNotifyFunc from '../../hooks/notify.func';
import { setReRenderSideBar } from '../../redux/features/special';
import ChatContentHandle from './handle';
function ChatContent(props) {
  const idRoomSelect = props.idRoomSelect;
  const [boxMessage, setBoxMessage] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [reRenderBoxMessage, setReRenderBoxMessage] = useState();
  const [listIdsUser, setListIdsUser] = useState([]);
  const [nameGroup, setNameGroup] = useState();
  const [notify] = useNotifyFunc();
  const openCreateGroup = useSelector((state) => state.special.isCreateGroup);
  const dispatch = useDispatch();
  let token = jwtDecode(localStorage.getItem('token'));
  let idUserInit = token.idUser;
  const refBoxMessage = useRef(null);
  const emitype = useSelector((state) => state.special.emitType);
  const handleGetData = (data) => {
    setListIdsUser(data);
  };

  useEffect(() => {
    const urlGetRoomData = `/rooms/data/${idRoomSelect}`;
    if (idRoomSelect)
      ApiBase.get(urlGetRoomData)
        .then((res) => {
          setBoxMessage(res.data.data);
        })
        .catch((e) => {
          if (e) console.log(e);
        });
  }, [idRoomSelect, reRenderBoxMessage]);

  useEffect(() => {
    if (boxMessage && !openCreateGroup)
      ChatContentHandle.scrollBottomBoxMessage(refBoxMessage);
  }, [boxMessage]);

  useEffect(() => {
    socket.on('reveice-private-chat', (data) => {
      setReRenderBoxMessage(Date.now());
    });
    socket.on('reveice-group-chat', (data) => {
      setReRenderBoxMessage(Date.now());
    });
  }, []);
  return (
    <div className="chat-content">
      {openCreateGroup && openCreateGroup ? (
        <>
          <div className="center">
            <input
              id="name-group-chat"
              className="search-chat"
              type="text"
              placeholder="Tên nhóm"
              onChange={(e) => {
                setNameGroup(e.target.value);
              }}
            />
          </div>
          <UserShare handleGetData={handleGetData} />
          <div className="center">
            <button
              className="btn-create-group-chat"
              onClick={() => {
                ChatContentHandle.handleCreateGroupChat(
                  nameGroup,
                  notify,
                  listIdsUser,
                  setListIdsUser,
                  setNameGroup,
                  idUserInit,
                  dispatch,
                  setReRenderSideBar,
                );
              }}
            >
              Thêm nhóm
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="chat-body">
            <ul className="box-message" ref={refBoxMessage}>
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
                        marginRight: e && e.idUser !== idUserInit ? '' : '40px',
                        alignItems: 'center',
                      }}
                    >
                      {e && e.idUser !== idUserInit ? (
                        <Avatar
                          alt="Remy Sharp"
                          src={e && host + e.background}
                        />
                      ) : (
                        ''
                      )}
                      <p className="content-message">{e.message}</p>
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
              value={newMessage}
              onChange={(e) => {
                ChatContentHandle.handleChangeMessage(e, setNewMessage);
              }}
              onKeyUp={(e) => {
                ChatContentHandle.handleEnterMessage(
                  e,
                  setNewMessage,
                  newMessage,
                  idRoomSelect,
                  idUserInit,
                  emitype,
                );
              }}
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
              onClick={(e) => {
                ChatContentHandle.handleSendMessage(
                  idRoomSelect,
                  newMessage,
                  idUserInit,
                  setNewMessage,
                  emitype,
                );
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ChatContent;
