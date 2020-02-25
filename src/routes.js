import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
// import PropTypes from "prop-types";
import App from "./App";
import UserPortfolio from "./UserPortfolio";

export default class Routes extends Component {
  componentDidMount() {}
  render() {
    return (
      <Switch>
        <Route exact path="/" component={withRouter(App)} />
        <Route exact path="/:id" component={withRouter(UserPortfolio)} />
      </Switch>
    );
  }
}
