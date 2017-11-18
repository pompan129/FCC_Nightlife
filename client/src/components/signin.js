import React ,{Component}from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {signinUser} from "../actions";
import "./signin.css";


class Signin extends Component{
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
      this.props.signinUser(this.state);
  }
  renderError(){
    if(this.props.error){
      return <div className="alert alert-danger">{this.props.error}</div>
    }
  }

  render(){
    return (
      <div className="signin-panel">
        <h3>Sign In</h3>
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
            {this.renderError()}
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
      </form>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {signinUser}, dispatch);
}

function mapStateToProps(state){
  return {error:state.user.error}
}


export default connect(mapStateToProps,mapDispatchToProps)(Signin);
