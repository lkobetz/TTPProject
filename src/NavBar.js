import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import axios from "axios";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      user: null
    };
  }
  async componentDidMount() {
    let page = window.location.href.toString();
    page = parseInt(page.slice(page.indexOf("#") + 2));
    this.setState({ url: page });
    const { data } = await axios.get(
      `/api/${window.sessionStorage.getItem("userId")}`
    );
    this.setState({ user: data });
  }
  async logout() {
    await window.sessionStorage.removeItem("userId");
  }
  render() {
    return (
      <div id={"navbar"}>
        {this.state.user && (
          <nav id="navbar">
            <Link
              className={"navbar_link"}
              params={"userPortfolio"}
              to={`/${this.state.user.id}`}
              style={{
                textDecoration: "none",
                color:
                  this.state.url === `${this.state.user.id}`
                    ? "aquamarine"
                    : "#6600ff"
              }}
            >
              <h5>Portfolio</h5>
            </Link>{" "}
            <Link
              className={"navbar_link"}
              params={"userTransactions"}
              to={`/${this.state.user.id}/transactions`}
              style={{
                textDecoration: "none",
                color:
                  this.state.url === `${this.state.user.id}/transactions`
                    ? "aquamarine"
                    : "#6600ff"
              }}
            >
              <h5>Transactions</h5>
            </Link>
            <Link
              onClick={this.logout}
              className={"navbar_link"}
              params={"logout"}
              to={"/"}
              style={{
                textDecoration: "none",
                color: "#6600ff"
              }}
            >
              <h5>Logout</h5>
            </Link>
          </nav>
        )}
      </div>
    );
  }
}

export default NavBar;
