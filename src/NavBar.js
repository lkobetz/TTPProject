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
    page = page.slice(page.indexOf("#") + 2);
    this.setState({ url: page });
    const { data } = await axios.get(
      `/api/${window.sessionStorage.getItem("userId")}`
    );
    this.setState({ user: data });
  }
  getUser;
  render() {
    return (
      <div>
        {this.state.user && (
          <nav id="navbar">
            <Link
              params={"userPortfolio"}
              to={`/${this.state.user.id}`}
              style={{
                textDecoration: "none",
                color:
                  this.state.url === `${this.state.user.id}`
                    ? "#6600ff"
                    : "black"
              }}
            >
              <h5>Portfolio</h5>
            </Link>{" "}
            <Link
              params={"userTransactions"}
              to={`/${this.state.user.id}/transactions`}
              style={{
                textDecoration: "none",
                color:
                  this.state.url === `${this.state.user.id}/transactions`
                    ? "#6600ff"
                    : "black"
              }}
            >
              <h5>Transactions</h5>
            </Link>
          </nav>
        )}
      </div>
    );
  }
}

export default NavBar;