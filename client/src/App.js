import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from './pages/home/Home';
import { useNavigate } from "react-router-dom";
import * as react from 'react'
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import ListContest from './components/listcontest/ListContest';
import ListUser from './components/listuser/ListUser';
import ListCandidate from './components/listcandidate/ListCandidate';
import UserForm from './components/userform/UserForm';
import FormContest from './components/formcontest/FormContest';
import FormCandidate from './components/formcandidate/FormCandidate';

function App() {
try{
  return (
    <Routes>
      <Route path={''} element={<Home/>}>
        <Route path='/users' element={<ListUser/>}/>
        <Route path='/new-users' element={<UserForm/>}/>
        <Route path='/contests' element={<ListContest/>}/>
        <Route path='/new-contest' element={<FormContest/>}/>
        <Route path='/candidates' element={<ListCandidate/>}/>
        <Route path='/new-candidate' element={<FormCandidate/>}/>
      </Route>
      <Route path={'/register'} element={<Register/>}/>
      <Route path={'/auth/login'} element={<Login/>}/>
    </Routes>
  );
}catch(e){

  if(e) console.log(e);

}finally{

  console.log("hello newbie");

}
  
}

export default App;
