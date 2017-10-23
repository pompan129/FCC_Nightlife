import React from "react";
import './loader.css';

const Loader = (props)=>{
  if(props.loading){
    return <div className="loader"></div>
  }
  return null;
}

export default Loader;
