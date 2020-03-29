import React from "react";
import axios from "axios";
import NavBar from "./NavBar";
import StockPortfolio from "./StockPortfolio";
import BuyStockForm from "./BuyStockForm";

class UserPortfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      allLatestPrices: {},
      totalStockValue: 0,
      readyToRender: false
    };
    this.addStock = this.addStock.bind(this);
  }
  async componentDidMount() {
    await this.getUpdatedUser();
    const result = await this.getPriceOfAllStocks();
    this.setState({
      allLatestPrices: result.latestPrices,
      totalStockValue: result.totalStockValue,
      readyToRender: true
    });
  }
  async getUpdatedUser() {
    // if statement prevents displaying data of most recent user after they log out
    if (window.localStorage.length) {
      // get the user from localStorage so it only displays data of logged in user
      const { data } = await axios.get(
        `/api/${window.localStorage.getItem("userId")}`
      );
      // here we just make sure we're not saving any user info we don't need on the front end
      const user = {
        name: data.name,
        id: data.id,
        cash: data.cash,
        transactions: data.transactions
      };
      this.setState({ user: user });
    }
  }
  async getPriceOfAllStocks() {
    let totalsOfEach = [];
    let latestPrices = {};
    if (this.state.user && this.state.user.transactions.length) {
      await Promise.all(
        // this function reduces the sum of latestPrices of all bought stocks into a total value to display at the top, also adds the latest price of each stock to an object to pass to the SingleStock component so it can render it
        this.state.user.transactions.map(async stock => {
          let latestPrice = await this.callApi(stock.name);
          totalsOfEach.push(latestPrice * stock.quantity);
          latestPrices[stock.name] = latestPrice;
        })
      );
      const totalStockValue = totalsOfEach
        .reduce((first, second) => {
          return (first += second);
        })
        .toFixed(2);
      return { totalStockValue, latestPrices };
    } else {
      return 0;
    }
  }
  async callApi(stockName) {
    const { data } = await axios.get(`/api/${this.state.user.id}/apicall`, {
      params: {
        ticker: stockName
      }
    });
    return data.latestPrice;
  }
  // this triggers a component rerender by updating the state, is called in BuyStockForm when the user buys a new stock
  async addStock() {
    // we don't want the component to rerender until we've gotten the updated user and updated the latestPrices object though, because otherwise if this is the user's first purchase it will send an empty object to SingleStock
    this.setState({ readyToRender: false });
    await this.getUpdatedUser();
    const result = await this.getPriceOfAllStocks();
    this.setState({
      allLatestPrices: result.latestPrices,
      totalStockValue: result.totalStockValue,
      readyToRender: true
    });
  }
  render() {
    return (
      <div className="App">
        {this.state.readyToRender ? (
          <div>
            <NavBar user={this.state.user} />
            <div id={"portfolio_container"}>
              <h1 id={"portfolio_header"}>
                Total Value of {this.state.user.name}'s Stocks: $
                {this.state.totalStockValue || 0}
              </h1>
              <div id={"portfolio_body"}>
                <StockPortfolio
                  user={this.state.user}
                  allLatestPrices={this.state.allLatestPrices}
                />
                <BuyStockForm user={this.state.user} addStock={this.addStock} />
              </div>
            </div>
          </div>
        ) : (
          <h2 id={"loading"}>Loading...</h2>
        )}
      </div>
    );
  }
}

export default UserPortfolio;
