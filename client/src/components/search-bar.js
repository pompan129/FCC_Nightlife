import React from "react";
import { withRouter } from 'react-router';


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
      this.props.handleSubmit(this.state.value)
    }

    render() {
      console.log("SearchBar",this.state.value);//todo
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Location:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
}

const SearchBarWithRouter = withRouter(SearchBar)
export default SearchBarWithRouter;
