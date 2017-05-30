import React from "react";
import BusinessItem from "./business-item";

const BusinessList = (props)=>{
//todo -fix key in list
  console.log("ActivetyList", props)

  return <div className="activety-list">
    Activety List
    <div className="business-list">
      {Object.keys(props.list).map((key,index)=><BusinessItem key={key} business={props.list[key]}  ></BusinessItem>)}
    </div>
  </div>
}

export default BusinessList;
