import React, { useEffect } from 'react';
import SideBar from '../side-bar/SideBar';
import './index.css';
import Body from '../body/Body';
import Header from '../header/Header';
import { useDispatch } from 'react-redux';
import { Handle } from './handle';
function Base(props) {
  Handle.dispatch = useDispatch();
  return (
    <div id="box-container">
      <Header />
      <SideBar />
      <Body />
    </div>
  );
}

export default Base;
