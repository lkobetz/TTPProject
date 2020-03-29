import React from "react";
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      alert: 0
    };
  }

  onNameChange(event) {
    this.setState({ name: event.target.value });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.props.userType === "new") {
      try {
        const response = await axios.post("/api/register", this.state);
        this.resetForm();
        if (response.status === 200) {
          // exclude unnecessary info (like email) from user data because we don't need access to them on the front end and we don't want to accidentally expose them
          const user = {
            id: response.data.id,
            name: response.data.name,
            transactions: response.data.transactions
          };
          await window.localStorage.setItem("userId", user.id);
          this.props.changeUser(user);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            this.setState({ alert: 400 });
          }
          if (error.response.status === 409) {
            this.setState({ alert: 409 });
          }
        }
      }
    } else if (this.props.userType === "existing") {
      try {
        const response = await axios.post("/api/login", this.state);
        this.resetForm();
        if (response.status === 200) {
          const id = response.data.id;
          await window.localStorage.setItem("userId", id);
          // exclude unnecessary info (like email) from user data because we don't need access to them on the front end and we don't want to accidentally expose them
          const user = {
            id: response.data.id,
            name: response.data.name
          };
          await window.localStorage.setItem("userId", user.id);
          this.props.changeUser(user);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            this.setState({ alert: 400 });
          }
          if (error.response.status === 404) {
            this.setState({ alert: 404 });
          }
        }
      }
    }
  }
  resetForm() {
    this.setState({ name: "", email: "", message: "" });
  }

  render() {
    return (
      <div>
        {this.state.alert === 400 && (
          <h5 className={"form_item"}>
            Please enter a name, username, and password.
          </h5>
        )}
        {this.state.alert === 409 && (
          <h5 className={"form_item"}>
            That email address has already been registered.
            <br /> Please choose another email address.
          </h5>
        )}
        {this.state.alert === 404 && (
          <h5 className={"form_item"}>Incorrect email and / or password.</h5>
        )}
        <form onSubmit={this.handleSubmit.bind(this)} method="POST">
          <div>
            <input
              className={"form_item"}
              type="text"
              value={this.state.name}
              placeholder={"Name"}
              onChange={this.onNameChange.bind(this)}
            />
          </div>
          <br />
          <div>
            <input
              className={"form_item"}
              type="email"
              aria-describedby="emailHelp"
              value={this.state.email}
              placeholder={"Email"}
              onChange={this.onEmailChange.bind(this)}
            />
          </div>{" "}
          <br />
          <div>
            <input
              className={"form_item"}
              type="password"
              value={this.state.password}
              placeholder={"Password"}
              onChange={this.onPasswordChange.bind(this)}
            />
          </div>
          <br />
          <button type="submit" className="submit_button">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
