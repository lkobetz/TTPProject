import React from "react";
import "./App.css";
import Login from "./Login";
import { Link } from "react-router-dom";

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
        {this.state.user === null ? (
          <div>
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
              <Login
                userType={this.state.userType}
                changeUser={this.changeUser}
              />
            )}
          </div>
        ) : (
          <div id={"welcome_text"}>
            <h1>Welcome, {this.state.user.name}!</h1>
            <div id={"welcome_links"}>
              <Link to={`/${this.state.user.id}`}>
                <h3>View Portfolio</h3>
              </Link>
              <Link to={`/${this.state.user.id}/transactions`}>
                <h3>View Transactions</h3>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
