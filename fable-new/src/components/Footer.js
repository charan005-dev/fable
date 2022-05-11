import React from "react";
import "../App.css";
//import { BottomNavigation } from '@mui/material'

function Footer() {
  return (
    <div className="main-footer">
      <div className="container">
        <hr />
        <div className="row">
          <p className="col-sm">&copy;{new Date().getFullYear()} | Code Pirates</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
