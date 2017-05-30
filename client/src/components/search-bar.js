import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import {fetchBusinesses} from '../actions';


class SearchBar extends React.Component{
  constructor(props) {
      super(props);
      this.state = {value: ''};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit(event){
      event.preventDefault();
      this.props.fetchBusinesses("bars",this.state.value,()=>{this.props.history.push("/list")});
    }

    render() {
      console.log("SearchBar",this.state.value);//todo
      return (
        <div className="row">
          <form onSubmit={this.handleSubmit} className="col-sm-6 col-sm-offset-3">
            <div className="input-group">
                      <input type="text"
                        className="form-control"
                        value={this.state.value}
                        onChange={this.handleChange}
                        placeholder="Address, neighborhood, city, state or zip&hellip;"/>
                      <span className="input-group-btn">
                          <button type="submit" className="btn btn-default">Search</button>
                      </span>
                  </div>
          </form>
        </div>
      );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
      {fetchBusinesses}, dispatch);
}

const SearchBarWithRouter = withRouter(SearchBar)
export default connect(null,mapDispatchToProps)(SearchBarWithRouter);
