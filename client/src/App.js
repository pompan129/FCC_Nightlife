import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter,Route,Switch, Link} from 'react-router-dom';
import Navbar from './components/navbar';
import SearchBar from './components/search-bar';
import Home from './components/home';
import Signup from './components/signup';
import Signin from './components/signin';
import Loader from "./components/loader";
import ModalWrapper from "./components/modal-wrapper";
import BusinessList from './components/business-list';
import {fetchBusinesses,renderModal,signOut,addRemoveUserToBusiness} from './actions';//todo remove fetchBusinesses?
import logo from './robot_1.png';
import './App.css';


class App extends Component {
  render() {
    return (
        <div className="App">
            <BrowserRouter>
              <div className='app-container'>
                <div className="App-header">
                  <Navbar
                    signOut={()=>this.props.signOut()}
                    renderModal={(modal)=>this.props.renderModal(modal)}
                    authenticated={this.props.user.authenticated}></Navbar>
                    <Link to="/">
                      <div className="App-logo">
                        <img src={logo} alt="logo"/>
                      </div>
                    </Link>
                  <h1>Nightlife Coordinate-Imatron</h1>
                  <SearchBar />
                </div>
                <Switch>
                  <Route exact path='/'
                    render={()=><Home
                    fetchBusinesses={this.props.fetchBusinesses} />} />
                  <Route  path='/list'
                    render={()=><BusinessList
                      addRemoveUserToBusiness={this.props.addRemoveUserToBusiness}
                      list={this.props.businesses}/>} />
                </Switch>
              </div>
            </BrowserRouter>
            <Loader loading={this.props.message.fetching}/>
            <ModalWrapper visible={this.props.modal.type} handleVisibility={()=>this.props.renderModal(false)}>
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
      {fetchBusinesses,renderModal,signOut,addRemoveUserToBusiness}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
