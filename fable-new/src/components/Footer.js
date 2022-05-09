import React from "react";
import "../App.css";
//import { BottomNavigation } from '@mui/material'

function Footer() {
  return (
    <div className="main-footer">
      <div className="container">
        <div className="row">
          {/* Column2 */}
          <div className="col">
            <h4>Contact Us</h4>
            <ui className="list-unstyled">
              <li>United States</li>
              <li>United Kingdom</li>
              <li>Australia</li>
            </ui>
          </div>
          {/* Column3 */}
        </div>
        <hr />
        <div className="row">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} | All rights reserved | Terms Of
            Service | Privacy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;