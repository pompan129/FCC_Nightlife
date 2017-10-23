import React from "react";
import './home.css';

const Home = (props)=>{
  return (
    <div className="home">
      <p>Enter a location above.</p>
      <p>See what places are hoppin' tonight and let your friends know your going!</p>
      <p><span className="glyphicon glyphicon-glass"> </span> Drink responsibly, and always use designated driver
          ...or call a cab <span className="glyphicon glyphicon-phone"> </span></p>
    </div>
  )
}

export default Home;
