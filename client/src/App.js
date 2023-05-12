import './App.css';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setId } from './redux/features/user.slice';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import Body from './base/body/Body';
import Base from './base/base/Base';
import Candidate from './pages/candidate/Candidate';
import NewCandidate from './pages/candidate/new/NewCandidate';

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
        {/* <Route path={''} element={<Home />}>
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
        </Route> */}
        <Route path={'/register'} element={<Register />} />
        <Route path={'/auth/login'} element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="" element={<Base />}>
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/new-candidate" element={<NewCandidate />} />
          <Route path="/candidate/:id" element={<NewCandidate />} />
          <Route path="/company" />
          <Route path="/contest" />
        </Route>
      </Routes>
    );
  } catch (e) {
    if (e) console.log(e);
  } finally {
    console.log('hello newbie');
  }
}

export default App;
