import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AlertComponents from '../../components/alert/Alert';
import FormCandidate from '../../components/formcandidate/FormCandidate';
import FormContest from '../../components/formcontest/FormContest';
import ListCandidate from '../../components/listcandidate/ListCandidate';
import ListContest from '../../components/listcontest/ListContest';
import ListUser from '../../components/listuser/ListUser';
import UserForm from '../../components/userform/UserForm';
import { BTN_LOG_OUT } from '../../contants/btn';
import { LOGO } from '../login/intro';
import './index.css' ;
const listView = [
    'form-user' ,
    'list-user',
    'form-candidate',
    'form-contest',
    'list-contest',
    'list-candidate',
]
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
        setShow(listView[0])
    }
    const showListUser = () =>{
        setShow(listView[1])
        setReRender(Date.now())
    }

    const showCandidate = () =>{
        setShow(listView[2])
    }
    const showContest = () =>{
        setShow(listView[3])
    }
 
    const showListCandidate = () =>{
        setShow(listView[4])
    }
    const showListContest = () =>{
        setShow(listView[5])
    }

    const handleReRender = () =>{
        setReRender(Date.now())
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
                {show && show ===  listView[0]  ? <UserForm handleReRender={handleReRender}/> : ''}
                {show && show === listView[1] ? <ListUser reRender={reRender} handleReRender={handleReRender}/> : ''}
                {show && show === listView[2] ? <FormCandidate/> : ''}
                {show && show === listView[3] ? <FormContest/> : ''}
                {show && show === listView[4] ? <ListContest/> : ''}
                {show && show === listView[5] ? <ListCandidate/> : ''}
                <AlertComponents/>
                </div>
            </div>
        );
    }
    
}

export default Home;