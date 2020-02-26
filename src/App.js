import React from "react";
import "./App.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Login from "./Login";
// import UserPortfolio from "./UserPortfolio";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      userType: "",
      user: null
    };
    this.changeUser = this.changeUser.bind(this);
  }
  async getResponse(info) {
    const { data } = await axios.post("/api/login", info);
    console.log(data);
  }
  toggleFunc(user) {
    this.setState({ toggle: !this.state.toggle });
    this.setState({ userType: user });
  }
  changeUser(loggedInUser) {
    this.setState({ user: loggedInUser });
  }
  render() {
    return (
      <div className="App">
        <button onClick={() => this.toggleFunc("new")}>Register</button>
        <button onClick={() => this.toggleFunc("existing")}>Login</button>
        {this.state.toggle && (
          <Login userType={this.state.userType} changeUser={this.changeUser} />
        )}
        {this.state.user && (
          <Redirect
            to={{
              pathname: `/${this.state.user.id}`,
              state: { user: this.state.user }
            }}
          ></Redirect>
        )}
      </div>
    );
  }
}

export default App;
