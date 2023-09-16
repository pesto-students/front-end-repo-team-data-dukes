import React from "react";

import "./index.css";

const Footer = () => {
  return (
    <div className="footer-style">
      {`Copyright © ${new Date().getFullYear()} TalkTime. All rights reserved.`}
    </div>
  );
};

export default Footer;
