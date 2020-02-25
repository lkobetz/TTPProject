import React from "react";
// import axios from "axios";

class UserPortfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log(this.props.location.state.user);
    return <div className="App"></div>;
  }
}

export default UserPortfolio;
