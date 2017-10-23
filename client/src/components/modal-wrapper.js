import React from "react";
import "./modal-wrapper.css";


const ModalWrapper = (props)=>{
   if(!props.visible){return null;}
   return (
      <div  className="modal-wrap">
         <div className="msg-modal-backdrop"
           onClick={()=>props.handleVisibility(false)}></div>
         <div className="msg-modal">
            {props.children}
         </div>
      </div>

   )
}

export default ModalWrapper;
