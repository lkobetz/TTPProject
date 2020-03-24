import React from "react";
import "./App.css";
import { Redirect } from "react-router-dom";
import Login from "./Login";

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
  toggleFunc(user) {
    if (this.state.userType === user) {
      this.setState({ toggle: !this.state.toggle });
    } else if (!this.state.toggle) {
      this.setState({ toggle: !this.state.toggle });
      this.setState({ userType: user });
    } else if (this.state.userType === "new") {
      this.setState({ userType: "existing" });
    } else {
      this.setState({ userType: "new" });
    }
  }
  changeUser(loggedInUser) {
    this.setState({ user: loggedInUser });
  }
  render() {
    const loginColor = this.state.userType === "existing" ? "#6600ff" : "black";
    const registerColor = this.state.userType === "new" ? "#6600ff" : "black";
    return (
      <div id="login">
        <h3>Login or Register to View Your Stock Portfolio</h3>
        <button
          className={"button"}
          style={{ backgroundColor: registerColor, color: "white" }}
          onClick={() => this.toggleFunc("new")}
        >
          Register
        </button>
        <button
          className={"button"}
          style={{ backgroundColor: loginColor, color: "white" }}
          onClick={() => this.toggleFunc("existing")}
        >
          Login
        </button>
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
