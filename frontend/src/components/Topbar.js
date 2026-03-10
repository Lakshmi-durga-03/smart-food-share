import React from "react";
import logo from "../assets/logo.png";

function Topbar(){
  return(
    <div className="topbar">

      {/* LEFT SIDE */}
      <div className="top-left">
        <img src={logo} alt="logo" className="logo-img"/>
        <h2>FoodShare</h2>
      </div>

      {/* RIGHT SIDE */}
      <button className="logout-btn"
        onClick={()=>{
          localStorage.clear();
          window.location.href="/";
        }}>
        Logout
      </button>

    </div>
  )
}

export default Topbar;