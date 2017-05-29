import React from "react";

const BusinessItem = (props)=>{
  console.log("ActivetyItem", props)
  return (
    <li className="activety-item">
      activety {props.business.name}
    </li>
  )

}

export default BusinessItem;
