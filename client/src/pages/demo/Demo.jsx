import React, { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './index.css';
import { Handle } from './handle';
function Demo(props) {
  const [dropdown, setDropdown] = useState();
  useEffect(() => {
    Handle.setDropdown = setDropdown;
  }, []);
  useEffect(() => {
    Handle.dropdown = dropdown;
  }, [dropdown]);
  return (
    <div>
      <div className="dd" onClick={Handle.dropdownHandle}>
        <div className="dd-title">
          <p className="dd-title-desc">Hey</p>
          <KeyboardArrowDownIcon />
        </div>
        <ul className="dd-content">
          <li className="dd-item">fack of</li>
          <li className="dd-item">dame ab</li>
          <li className="dd-item">test cccsss</li>
        </ul>
      </div>
    </div>
  );
}

export default Demo;
