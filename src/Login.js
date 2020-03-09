import React from "react";
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }

  render() {
    return (
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
    );
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
      const response = await axios.post("/api/register", this.state);
      this.resetForm();
      if (response.status === 200) {
        const id = response.data.id;
        await window.sessionStorage.setItem("userId", id);
        this.props.changeUser(response.data);
      }
    } else if (this.props.userType === "existing") {
      const response = await axios.post("/api/login", this.state);
      this.resetForm();
      if (response.status === 200) {
        const id = response.data.id;
        await window.sessionStorage.setItem("userId", id);
        this.props.changeUser(response.data);
      }
    }
  }
  resetForm() {
    this.setState({ name: "", email: "", message: "" });
  }
}

export default Login;
