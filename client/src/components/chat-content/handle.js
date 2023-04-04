import { useDispatch } from 'react-redux';
import { socket } from '../../socket/socket';
import { ERROR } from '../../contants/notify/type.notify';
import {
  GROUP_MEMBER_ERROR,
  NAME_GROUP_HOLLOW,
} from '../../contants/notify/message';
import { TRUE } from '../../contants/notify/status.notify';
import { ApiBase } from '../../api/api.base';
import { EMIT_TYPE } from '../../contants/emit.type';

class ChatContentHandle {
  static handleChangeMessage(e, setNewMessage) {
    setNewMessage(e.target.value);
  }
  static handleEnterMessage(
    e,
    setNewMessage,
    newMessage,
    idRoomSelect,
    idUserInit,
    emitType,
  ) {
    if (e.key === 'Enter')
      if (idRoomSelect && newMessage !== '') {
        let data = {
          message: newMessage,
          file: undefined,
          idRoom: idRoomSelect,
          idUser: idUserInit,
        };
        if (emitType === EMIT_TYPE.private) {
          socket.emit('private-chat', data);
        } else {
          socket.emit('chat-group', data);
        }
        setNewMessage('');
      }
  }
  static handleSendMessage(
    idRoomSelect,
    newMessage,
    idUserInit,
    setNewMessage,
    emitType,
  ) {
    if (idRoomSelect && newMessage !== '') {
      let data = {
        message: newMessage,
        file: undefined,
        idRoom: idRoomSelect,
        idUser: idUserInit,
      };
      if (emitType === EMIT_TYPE.private) {
        socket.emit('private-chat', data);
      } else {
        socket.emit('chat-group', data);
      }
      setNewMessage('');
    }
  }
  static scrollBottomBoxMessage(refBoxMessage) {
    if (!refBoxMessage) return;
    refBoxMessage.current.scrollTop = refBoxMessage.current.scrollHeight;
  }
  static handleCreateGroupChat(
    nameGroup,
    notify,
    listIdsUser,
    setListIdsUser,
    setNameGroup,
    idUserInit,
    dispatch,
    setReRenderSideBar,
  ) {
    const url = '/rooms/group';
    if (!nameGroup) {
      notify(ERROR, NAME_GROUP_HOLLOW, TRUE);
      return;
    }
    if (listIdsUser.length < 1) {
      notify(ERROR, GROUP_MEMBER_ERROR, TRUE);
    }

    let data = {
      idUser: idUserInit,
      name: nameGroup,
      idsConnectRoom: listIdsUser,
    };

    ApiBase.post(url, data)
      .then((res) => {
        dispatch(setReRenderSideBar(Date.now()));
      })
      .catch((e) => {
        if (e) {
          notify(ERROR, e.response.data.message, TRUE);
        }
      });
    setListIdsUser([]);
    setNameGroup('');
  }
}
export default ChatContentHandle;
