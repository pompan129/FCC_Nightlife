import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter,Route,Switch} from 'react-router-dom';
import SearchBar from './components/search-bar';
import Home from './components/home';
import Signup from './components/signup';
import Signin from './components/signin';
import Loader from "./components/loader";
import BusinessList from './components/business-list';
import {fetchBusinesses} from './actions';
import logo from './robot_1.png';
import './App.css';


class App extends Component {
  render() {
    console.log("App/businesses: ",  this.props.businesses )
    return (
        <div className="App">
            <BrowserRouter>
              <div className='app-container'>
                <div className="App-header">
                  <div className="App-logo">
                    <img src={logo} alt="logo" />
                  </div>
                  <h1>Nightlife Coordinate-Imatron</h1>
                  <SearchBar />
                </div>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route  path='/signup' component={Signup}  />
                  <Route  path='/signin' component={Signin}  />
                  <Route  path='/list'
                    render={()=><BusinessList
                      list={this.props.businesses}/>} />
                </Switch>
              </div>
            </BrowserRouter>
            <Loader loading={this.props.message.fetching}/>
        </div>
    );
  }
}

function mapStateToProps({user,businesses,message}){
    return {user,businesses,message}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {fetchBusinesses}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
