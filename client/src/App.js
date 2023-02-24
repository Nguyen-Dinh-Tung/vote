import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from './pages/home/Home';
import { useNavigate } from "react-router-dom";
import * as react from 'react'
import Register from './pages/register/Register';
import Login from './pages/login/Login';

function App() {
try{
  return (
    <Routes>
      <Route path={''} element={<Home/>}/>
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
