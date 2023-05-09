import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import AlertComponents from '../../components/alert/Alert';
import { BTN_LOG_OUT } from '../../contants/btn';
import { LOGO } from '../login/intro';
import './index.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Sse from '../../components/sse/sse';
import { socket } from '../../socket/socket';
import ForumIcon from '@mui/icons-material/Forum';
import { ApiBase } from '../../api/api.base';
function Home(props) {
  let token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [notifies, setNotifies] = useState(0);
  let username = '';

  if (token) {
    username = jwtDecode(token).username;
  }

  const showLogin = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
    socket.disconnect();
  };
  const showUserForm = () => {
    navigate('/new-users');
  };
  const showListUser = () => {
    navigate('/users');
  };

  const showContest = () => {
    navigate('/new-contest');
  };

  const showListContest = () => {
    navigate('/contests');
  };

  const showListCandidate = () => {
    navigate('/candidates');
  };
  const showCandidate = () => {
    navigate('/new-candidate');
  };
  const showCompany = () => {
    navigate('/new-company');
  };
  const showListCompany = () => {
    navigate('/companies');
  };
  const showHome = () => {
    navigate('/');
  };
  const showChat = () => {
    navigate('/chat');
  };
  const showAddFriendsPage = () => {
    navigate('/new-friend');
  };
  const showFriends = () => {
    navigate('/friend');
  };
  useEffect(() => {
    if (token == null) {
      navigate('/auth/login');
    }
  }, [token]);

  useEffect(() => {
    socket.connect();
  }, []);
  useEffect(() => {
    const urlGetNotify = `/notify-app`;
    ApiBase.get(urlGetNotify)
      .then((res) => {
        setNotifies(res.data.notify);
      })
      .catch((e) => {
        if (e) console.log(e);
      });
  }, []);
  if (token) {
    return (
      <div className="container-home">
        <div className="side-bar">
          <div className="top-side-bar">
            <div className="top">
              <div
                className="logo"
                style={{
                  cursor: 'pointer',
                }}
                onClick={showHome}
              >
                {LOGO}
              </div>
              <div className="notify">
                <NotificationsNoneIcon sx={{ cursor: 'pointer' }} />
                <p
                  className="amount-notify"
                  style={{
                    color: notifies && notifies.length > 0 ? 'red' : 'green',
                    fontWeight: 700,
                  }}
                >
                  {notifies && notifies.length}
                </p>
              </div>
            </div>
            <div className="user">
              <p className="username">
                {' '}
                Xin chào{' '}
                <span className="text-username">{username && username}</span> !
              </p>
              <ForumIcon
                sx={{
                  cursor: 'pointer',
                  fontSize: '30px',
                  ':hover': {
                    color: '#05e61f',
                  },
                }}
                onClick={showChat}
              />
            </div>
            <div class="dropdown dropdown-user">
              <p className="box-icons">
                Tài khoản{' '}
                <span className="icons">
                  <ExpandMoreIcon fontSize={'large'} sx={{ widht: '20px' }} />
                </span>
              </p>
              <div class="menu-user">
                <p className="field-controler" onClick={showUserForm}>
                  Tạo mới
                </p>
                <p className="field-controler" onClick={showListUser}>
                  Danh sách
                </p>
              </div>
            </div>
            <div className="dropdown dropdown-candidate">
              <p className="box-icons">
                Tổ chức{' '}
                <span className="icons">
                  <ExpandMoreIcon fontSize={'large'} sx={{ widht: '20px' }} />
                </span>
              </p>
              <div className="menu-candidate">
                <p className="field-controler" onClick={showCompany}>
                  Thêm tổ chức
                </p>
                <p className="field-controler " onClick={showListCompany}>
                  Danh sách tổ chưc
                </p>
              </div>
            </div>
            <div className="dropdown dropdown-contest">
              <p className="box-icons">
                Cuộc thi{' '}
                <span className="icons">
                  <ExpandMoreIcon fontSize={'large'} sx={{ widht: '20px' }} />
                </span>
              </p>
              <div className="menu-contest">
                <p className="field-controler" onClick={showContest}>
                  Thêm cuộc thi
                </p>
                <p className="field-controler" onClick={showListContest}>
                  Danh sách cuộc thi
                </p>
              </div>
            </div>
            <div className="dropdown dropdown-candidate">
              <p className="box-icons">
                Thí sinh{' '}
                <span className="icons">
                  <ExpandMoreIcon fontSize={'large'} sx={{ widht: '20px' }} />
                </span>
              </p>
              <div className="menu-candidate">
                <p className="field-controler" onClick={showCandidate}>
                  Thêm thí sinh
                </p>
                <p className="field-controler " onClick={showListCandidate}>
                  Danh sách thí sinh
                </p>
              </div>
            </div>
            <div className="dropdown dropdown-candidate">
              <p className="box-icons">
                Bạn bè{' '}
                <span className="icons">
                  <ExpandMoreIcon fontSize={'large'} sx={{ widht: '20px' }} />
                </span>
              </p>
              <div className="menu-candidate">
                <p className="field-controler" onClick={showAddFriendsPage}>
                  Kết bạn
                </p>
                <p className="field-controler " onClick={showFriends}>
                  Danh sách bạn bè
                </p>
              </div>
            </div>
          </div>
          <div className="btn-log-out">
            <div className="btn-logout" onClick={showLogin}>
              {BTN_LOG_OUT}
            </div>
          </div>
        </div>
        <div className="content-home">
          <Outlet />
          <AlertComponents />
        </div>
      </div>
    );
  }
}

export default Home;
