import React from 'react';
import { DESIGN, FB_INFO, PHONE_NUMBER } from '../../pages/login/intro';
function Footer(props) {
  const showFacebook = () => {
    window.open('https://www.facebook.com/pharrealjun/');
  };
  return (
    <div className="footer">
      <div className="footer-info border-option">
        <p onClick={showFacebook}>{FB_INFO}</p>
        <span className="border-right"></span>
      </div>
      <div className="footer-info border-option">
        <p>{PHONE_NUMBER}</p>
        <span className="border-right "></span>
      </div>
      <div className="footer-info border-option">
        <p>{DESIGN}</p>
      </div>
    </div>
  );
}

export default Footer;
