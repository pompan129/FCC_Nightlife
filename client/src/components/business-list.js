import React from "react";
import BusinessItem from "./business-item";

const BusinessList = (props)=>{
//todo -fix key in list
  console.log("ActivetyList", props)
  return <div className="activety-list">
    Activety List
    <ul>
      {props.list.map((item,index)=><BusinessItem key={index} business={item}  ></BusinessItem>)}
    </ul>
  </div>
}

export default BusinessList;
