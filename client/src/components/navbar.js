import React from "react";
import {Link} from 'react-router-dom'
import './navbar.css';


const Navbar = (props)=>{

  return(
    <div className="nav">
      {!props.authenticated && <button
        onClick={()=>props.renderModal("signin")}
        className="pull-right">Sign In</button>}
      {!props.authenticated && <button
        onClick={()=>props.renderModal("signup")}
        className="pull-right">Sign Up</button>}
      {props.authenticated && <button
          onClick={props.signOut}
         className="pull-right">Sign Out</button>}
    </div>
  )
}

export default Navbar;
