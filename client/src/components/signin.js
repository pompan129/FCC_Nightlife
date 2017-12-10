import React ,{Component}from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {signinUser,LoginUser_JWT,renderModal} from "../actions";
import TwitterLogin from 'react-twitter-auth';
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
     this.onTwitterFail = this.onTwitterFail.bind(this);
     this.onTwitterSuccess = this.onTwitterSuccess.bind(this);
   }

  handleInputChange(event){
    event.preventDefault();
    this.setState({[ event.target.id]:event.target.value})
  }

  handleSubmit(event){
      event.preventDefault();
      this.props.signinUser(this.state);
  }

  onTwitterFail(error){
    console.log("onTwitterFail",error);
  }

  onTwitterSuccess(resp){
    const token = resp.headers.get('x-auth-token');
    resp.json().then(data=>{
      console.log("onTwitterSuccess",data,token, data.username);//TODO
      this.props.LoginUser_JWT(token, data.username);
      this.props.renderModal(false);
    });
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
      <hr/>
      <div className="social-logins">
        <h3>or</h3>
        <TwitterLogin   loginUrl="/api/auth/twitter"
            requestTokenUrl="/api/auth/twitter/reverse"
            onFailure={this.onTwitterFail}
            onSuccess={this.onTwitterSuccess}
          >
        </TwitterLogin>
      </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {signinUser,LoginUser_JWT,renderModal}, dispatch);
}

function mapStateToProps(state){
  return {error:state.user.error}
}


export default connect(mapStateToProps,mapDispatchToProps)(Signin);
