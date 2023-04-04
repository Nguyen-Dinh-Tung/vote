import { Avatar } from '@mui/material';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ApiBase, host } from '../../api/api.base';
import './index.css';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import { useDispatch, useSelector } from 'react-redux';
import { setEmitType, setIsCreateGroup } from '../../redux/features/special';
import ChatSideBarHandle from './handle';
import { EMIT_TYPE } from '../../contants/emit.type';
function ChatSideBar(props) {
  const [privateRooms, setPrivateRooms] = useState();
  const [groupRooms, setGroupRooms] = useState();
  let token = jwtDecode(localStorage.getItem('token'));
  let idUserInit = token.idUser;
  const setIdRoomSelect = props.setIdRoomSelect;
  const reRenderSideBar = useSelector((state) => state.special.reRenderSideBar);
  const dispatch = useDispatch();
  useEffect(() => {
    const urlGetUsers = `/rooms/${idUserInit}`;
    ApiBase.get(urlGetUsers)
      .then((res) => {
        setPrivateRooms(res.data.privateRooms);
        setGroupRooms(res.data.groupRooms);
      })
      .catch((e) => {
        if (e) console.log(e);
      });
  }, [reRenderSideBar]);

  return (
    <div
      style={{
        width: '26%',
        height: '100%',
        backgroundColor: '#c89ff0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 0.8,
      }}
    >
      <div className="side-bar-header">
        <input
          type="text"
          name="search"
          className="search-chat"
          placeholder="Nhập tên tài khoản"
        />
        <DataSaverOnIcon
          sx={{
            fontSize: '30px',
            ':hover': {
              color: 'white',
              cursor: 'pointer',
              fontSize: '40px',
            },
          }}
          onClick={() => {
            ChatSideBarHandle.showCreateGroup(dispatch, setIsCreateGroup);
          }}
        />
      </div>
      <div className="list-user-chat">
        <ul className="chat-list">
          {privateRooms &&
            privateRooms.map((e) => {
              return (
                <li
                  className="chat-element"
                  key={e.idRoom}
                  onClick={() => {
                    ChatSideBarHandle.handleSelectRoomChat(
                      dispatch,
                      e.idRoom,
                      setIsCreateGroup,
                      setIdRoomSelect,
                      EMIT_TYPE.private,
                    );
                    dispatch(setEmitType(EMIT_TYPE.private));
                  }}
                >
                  <Avatar alt="Remy Sharp" src={e && host + e.background} />
                  <p className="chat-username">{e && e.username}</p>
                </li>
              );
            })}
          <hr />
          {groupRooms &&
            groupRooms.map((e) => {
              return (
                <li
                  className="chat-element"
                  key={e.idRoom}
                  onClick={() => {
                    ChatSideBarHandle.handleSelectRoomChat(
                      dispatch,
                      e.id,
                      setIsCreateGroup,
                      setIdRoomSelect,
                    );
                    dispatch(setEmitType(EMIT_TYPE.group));
                  }}
                >
                  <Avatar alt="Remy Sharp" src={'../../../public/group.png'} />
                  <p className="chat-username">{e && e.name}</p>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default ChatSideBar;
