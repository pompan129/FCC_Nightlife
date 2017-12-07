import React from "react";
import './business-item.css';

const BusinessItem = (props)=>{
  const {name,id,url,image_url,display_phone,price,location,going} = props.business;
  return (
    <div className="media">
        <div className="media-left">
            <a href={url}>
                <img src={image_url} className="media-object img" alt={name}/>
            </a>
        </div>
        <div className="media-body">
            <h4 className="media-heading">{name}</h4>
            <div className="phone">{display_phone}</div>
            <div className="price">{price}</div>
        </div>
        <div className="media-right">
          <div className="btn-container">
            <div><button
              className="btn"
              onClick={()=>{props.addRemoveUserToBusiness(id)}}

              >{going.length} Going</button></div>
          </div>
        </div>
    </div>
  )

}

export default BusinessItem;
