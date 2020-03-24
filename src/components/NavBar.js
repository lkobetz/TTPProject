import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { withRouter } from "react-router-dom";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async logout() {
    await window.localStorage.removeItem("userId");
    await axios.post("/api/logout");
  }
  render() {
    return (
      <div id={"navbar"}>
        {this.props.user && (
          <nav id="navbar">
            <Link
              className={"navbar_link"}
              params={"userPortfolio"}
              to={`/${this.props.user.id}`}
              style={{
                textDecoration: "none",
                color:
                  this.props.location.pathname === `/${this.props.user.id}`
                    ? "aquamarine"
                    : "#6600ff"
              }}
            >
              <h4>Portfolio</h4>
            </Link>{" "}
            <Link
              className={"navbar_link"}
              params={"userTransactions"}
              to={`/${this.props.user.id}/transactions`}
              style={{
                textDecoration: "none",
                color:
                  this.props.location.pathname ===
                  `/${this.props.user.id}/transactions`
                    ? "aquamarine"
                    : "#6600ff"
              }}
            >
              <h4>Transactions</h4>
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
              <h4>Logout</h4>
            </Link>
          </nav>
        )}
      </div>
    );
  }
}

export default withRouter(NavBar);
