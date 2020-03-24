import React from "react";
import axios from "axios";
import NavBar from "./NavBar";
import StockPortfolio from "./StockPortfolio";
import BuyStockForm from "./BuyStockForm";

class UserPortfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.addStock = this.addStock.bind(this);
  }
  componentDidMount() {
    this.getUpdatedUser();
  }
  async getUpdatedUser() {
    // if statement prevents displaying data of most recent user after they log out
    if (window.localStorage.length) {
      // get the user from localStorage so it only displays data of logged in user
      const { data } = await axios.get(
        `/api/${window.localStorage.getItem("userId")}`
      );
      this.setState({ user: data });
    }
  }
  getPriceOfAllStocks() {
    let totalsOfEach = [];
    if (this.state.user.transactions.length) {
      this.state.user.transactions.forEach(stock => {
        totalsOfEach.push(stock.price * stock.quantity);
      });
      return totalsOfEach
        .reduce((first, second) => {
          return (first += second);
        })
        .toFixed(2);
    } else {
      return 0;
    }
  }
  // this triggers a component rerender by updating the state
  addStock() {
    this.getUpdatedUser();
  }
  render() {
    return (
      <div className="App">
        {this.state.user && (
          <div>
            <NavBar user={this.state.user} />
            <div id={"portfolio_container"}>
              <h1 id={"portfolio_header"}>
                Total Value of {this.state.user.name}'s Stocks: $
                {this.getPriceOfAllStocks()}
              </h1>
              <div id={"portfolio_body"}>
                <StockPortfolio user={this.state.user} />
                <BuyStockForm user={this.state.user} addStock={this.addStock} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserPortfolio;
