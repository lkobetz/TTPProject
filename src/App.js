import React from "react";
import "./App.css";
import axios from "axios";
import Login from "./Login";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      userType: "",
      status: false
    };
    this.changeUserStatus = this.changeUserStatus.bind(this);
  }
  async getResponse(info) {
    const { data } = await axios.post("/api/login", info);
    console.log(data);
  }
  toggleFunc(user) {
    this.setState({ toggle: !this.state.toggle });
    this.setState({ userType: user });
  }
  changeUserStatus() {
    this.setState({ status: !this.state.status });
  }
  render() {
    console.log(this.state);
    return (
      <div className="App">
        <button onClick={() => this.toggleFunc("new")}>Register</button>
        <button onClick={() => this.toggleFunc("existing")}>Login</button>
        {this.state.toggle && (
          <Login
            userType={this.state.userType}
            changeUserStatus={this.changeUserStatus}
          />
        )}
        {this.state.status && <h3>navigate to user's profile</h3>}
      </div>
    );
  }
}

export default App;
