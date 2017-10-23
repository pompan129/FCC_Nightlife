import React ,{Component}from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {signupUser} from "../actions";
import "./signup.css";


class Signup extends Component{
  constructor(props){
     super(props);
     this.state={
       email:"",
       password:""
     }
     this.handleInputChange = this.handleInputChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
   }

  handleInputChange(event){
    event.preventDefault();
    this.setState({[ event.target.id]:event.target.value})
  }

  handleSubmit(event){
      event.preventDefault();
      this.props.signupUser(this.state);
  }

  render(){
    console.log("Signup", this.state);// TODO:
    return (
      <div className="signup-panel">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={this.handleInputChange}
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"/>
          </div>
          <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={this.handleInputChange}
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"/>
          </div>
          <div className="btn-panel">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
      </form>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {signupUser}, dispatch);
}


export default connect(null,mapDispatchToProps)(Signup);
