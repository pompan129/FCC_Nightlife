import React from "react";
import './loader.css';

const Loader = (props)=>{
  console.log("Loader",props.loading);//todo
  if(props.loading){
    return <div className="loader"></div>
  }
  return null;
}

export default Loader;
