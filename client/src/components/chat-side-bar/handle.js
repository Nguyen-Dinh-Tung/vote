import { FALSE, TRUE } from '../../contants/notify/status.notify';

const { socket } = require('../../socket/socket');

class ChatSideBarHandle {
  static handleJoinRoom(id, idUserInit) {
    let data = {
      roomId: id,
      message: 'Hello',
      idUser: idUserInit,
      file: undefined,
    };
    console.log(data);
    socket.emit('chat-group', data);
  }
  static showCreateGroup(dispatch, setIsCreateGroup) {
    dispatch(setIsCreateGroup(TRUE));
  }

  static handleSelectRoomChat(dispatch, id, setIsCreateGroup, setIdRoomSelect) {
    dispatch(setIsCreateGroup(FALSE));
    setIdRoomSelect(id);
  }
}

export default ChatSideBarHandle;
