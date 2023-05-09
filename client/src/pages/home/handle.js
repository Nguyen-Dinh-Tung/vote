import { socket } from '../../socket/socket';

export class HomeHandle {
  static showLogin(navigate) {
    localStorage.removeItem('token');
    navigate('/auth/login');
    socket.disconnect();
  }
  static showUserForm(navigate) {
    navigate('/new-users');
  }
  static showListUser(navigate) {
    navigate('/users');
  }

  static showContest(navigate) {
    navigate('/new-contest');
  }

  static showListContest(navigate) {
    navigate('/contests');
  }

  static showListCandidate(navigate) {
    navigate('/candidates');
  }
  static showCandidate(navigate) {
    navigate('/new-candidate');
  }
  static showCompany(navigate) {
    navigate('/new-company');
  }
  static showListCompany(navigate) {
    navigate('/companies');
  }
  static showHome(navigate) {
    navigate('/');
  }
  static showChat(navigate) {
    navigate('/chat');
  }
  static showAddFriendsPage(navigate) {
    navigate('/new-friend');
  }
  static showFriends(navigate) {
    navigate('/friend');
  }
}
