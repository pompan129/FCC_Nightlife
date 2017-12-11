import React from "react";
import BusinessItem from "./business-item";
import "./business-list.css";


const BusinessList = (props)=>{
//todo -fix key in list
  return <div className="business-list">
      {Object.keys(props.list).map((key,index)=><BusinessItem
        key={key}
        business={props.list[key]}
        addRemoveUserToBusiness = {props.addRemoveUserToBusiness}
        ></BusinessItem>)}
    </div>

}

export default BusinessList;
