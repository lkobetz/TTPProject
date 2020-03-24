import React, { Component } from "react";
import { BrowserRouter, withRouter, Route, Switch } from "react-router-dom";
// import PropTypes from "prop-types";
import App from "./App";
import UserPortfolio from "./UserPortfolio";
import UserTransactions from "./UserTransactions";

export default class Routes extends Component {
  componentDidMount() {}
  render() {
    return (
      <Switch>
        <BrowserRouter basename={"/"}>
          <Route exact path="/" component={withRouter(App)} />
          <Route exact path="/:id" component={withRouter(UserPortfolio)} />
          <Route
            exact
            path="/:id/transactions"
            component={withRouter(UserTransactions)}
          />
        </BrowserRouter>
      </Switch>
    );
  }
}
