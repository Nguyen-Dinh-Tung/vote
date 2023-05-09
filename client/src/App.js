import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import ListContest from './components/listcontest/ListContest';
import ListUser from './components/listuser/ListUser';
import ListCandidate from './components/listcandidate/ListCandidate';
import UserForm from './components/userform/UserForm';
import FormContest from './components/formcontest/FormContest';
import FormCandidate from './components/formcandidate/FormCandidate';
import FormCompany from './components/formcompany/FormCompany';
import ListCompany from './components/listcompany/ListCompany';
import AssmCompany from './components/assm-company/AssmCompany';
import Test from './pages/test/Test';
import Friend from './pages/friend/Friend';
import NewFriend from './pages/new-friend/NewFriend';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setId } from './redux/features/user.slice';
import ForgotPassword from './pages/forgot-password/ForgotPassword';

function App() {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      const decodeToken = jwtDecode(token);
      dispatch(setId(decodeToken.idUser));
    }
  }, []);

  try {
    return (
      <Routes>
        <Route path={''} element={<Home />}>
          <Route path="/users" element={<ListUser />} />
          <Route path="/new-users" element={<UserForm />} />
          <Route path="/contests" element={<ListContest />} />
          <Route path="/new-contest" element={<FormContest />} />
          <Route path="/candidates" element={<ListCandidate />} />
          <Route path="/new-candidate" element={<FormCandidate />} />
          <Route path="/companies" element={<ListCompany />} />
          <Route path="/new-company" element={<FormCompany />} />
          <Route path="/assm-company/:id" element={<AssmCompany />} />
          <Route path="/chat" element={<Test />} />
          <Route path="/new-friend" element={<NewFriend />} />
          <Route path="/friend" element={<Friend />} />
        </Route>
        <Route path={'/register'} element={<Register />} />
        <Route path={'/auth/login'} element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/demo" element={<ForgotPassword />} /> */}
      </Routes>
    );
  } catch (e) {
    if (e) console.log(e);
  } finally {
    console.log('hello newbie');
  }
}

export default App;
