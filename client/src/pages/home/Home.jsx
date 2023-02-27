import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import AlertComponents from '../../components/alert/Alert';
import { BTN_LOG_OUT } from '../../contants/btn';
import { LOGO } from '../login/intro';
import './index.css' ;
function Home(props) {
    let token = localStorage.getItem('token');
    const navigate = useNavigate() ;
    const [show , setShow] = useState()
    const [reRender , setReRender]  = useState()
    let username =''

    if(token){
        username = jwtDecode(token).username
    }

    const showLogin = () =>{
        localStorage.removeItem('token')
        navigate('/auth/login')
    }
    const showUserForm = () =>{
        navigate('/new-users')
    }
    const showListUser = () =>{
        navigate('/users')
    }


    const showContest = () =>{
        navigate('/new-contest')
    }
    
    const showListContest = () =>{
        navigate('/contests')
    }

    const showListCandidate = () =>{
        navigate('/candidates')
    }
    const showCandidate = () =>{
        navigate('/new-candidate')

    }

    useEffect(() =>{
        if(token == null){
            navigate('/auth/login')
        }
    },[token])

    
    if(token){
        return (
            <div className='container-home'>
                <div className="side-bar">
                    <div className="top-side-bar">
                        <div className="logo">{LOGO}</div>
                        <div className="user">
                            <p className="username"> Xin chào <span className='text-username'>{username && username}</span> !</p>
                        </div>
                        <div class="dropdown dropdown-user">
                            <p>Tài khoản</p>
                            <div class="menu-user">
                            <p className='field-controler' onClick={showUserForm}>Tạo mới</p>
                            <p className='field-controler' onClick={showListUser}>Danh sách</p>
                            </div>
                        </div>
                        <div className="dropdown dropdown-contest">
                            <p>Cuộc thi</p>
                            <div className="menu-contest">
                                <p className='field-controler' onClick={showContest}>Thêm cuộc thi</p>
                                <p className='field-controler' onClick={showListContest}>Danh sách cuộc thi</p>
                            </div>
                        </div>
                        <div className="dropdown dropdown-candidate">
                            <p>Thí sinh</p>
                            <div className="menu-candidate">
                                <p className='field-controler' onClick={showCandidate}>Thêm thí sinh</p>
                                <p className='field-controler 'onClick={showListCandidate}>Danh sách thí sinh</p>
                            </div>
                        </div>
                    </div>
                    <div className="btn-log-out">
                        <div className="btn-logout" onClick={showLogin}>{BTN_LOG_OUT}</div>
                    </div>
                </div>
                <div className="content-home">
                <Outlet/>
                <AlertComponents/>
                </div>
            </div>
        );
    }
    
}

export default Home;