import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter,Route,Switch, Link} from 'react-router-dom';
import { withRouter } from 'react-router';
import Navbar from './components/Navbar';
import SearchBar from './components/search-bar';
import Home from './components/home';
import Signup from './components/signup';
import Signin from './components/signin';
import Loader from "./components/loader";
import ModalWrapper from "./components/modal-wrapper";
import BusinessList from './components/business-list';
import { renderModal,
    signOut,
    addRemoveUserToBusiness,
    setAuthErrorMessage,
    authRefreshJWT
  } from './actions';
import logo from './assets/robot_1.png';
import './App.css';


class App extends Component {
  componentWillMount() {
    const token = localStorage.getItem("jwt");
      if(!this.props.user.authenticated && token){
        localStorage.setItem("jwt","");
        this.props.authRefreshJWT(token);
      }
  }

  render() {
      console.log("businesses:", this.props.businesses);
      return (
        <div className="App">
            <div className="App-header">
              <Navbar
                signOut={()=>this.props.signOut()}
                renderModal={(modal)=>this.props.renderModal(modal)}
                authenticated={this.props.user.authenticated}>
              </Navbar>
              <div className="App-logo"
                onClick={()=>{localStorage.setItem("location","");}}>
                <Link to="/">
                  <img src={logo} alt="logo"/>
                </Link>
              </div>
              <h1>Nightlife Coordinate-Imatron</h1>
              <SearchBar />
            </div>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route  path='/list'
                render={()=><BusinessList
                  addRemoveUserToBusiness={this.props.addRemoveUserToBusiness}
                  list={this.props.businesses}/>} />
                <Route path='/twitter-callback' render={()=><div></div>} />/*empty route for auth callback url*/
            </Switch>
            <Loader loading={this.props.message.fetching}/>
            <ModalWrapper
              visible={this.props.modal.type}
              setAuthErrorMessage={(msg)=>this.props.setAuthErrorMessage(msg)}
              handleVisibility={()=>this.props.renderModal(false)}>
                {this.props.modal.type==="signup" && <Signup></Signup>}
                {this.props.modal.type==="signin" && <Signin></Signin>}
            </ModalWrapper>
        </div>
      );
  }
}

function mapStateToProps({user,businesses,message,modal}){
    return {user,businesses,message,modal}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      { renderModal,
        signOut,
        addRemoveUserToBusiness,
        setAuthErrorMessage,
        authRefreshJWT
      }, dispatch);
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
