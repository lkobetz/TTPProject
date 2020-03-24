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
      totalStockValue: 0
    };
    this.addStock = this.addStock.bind(this);
  }
  async componentDidMount() {
    await this.getUpdatedUser();
    const result = await this.getPriceOfAllStocks();
    this.setState({
      allLatestPrices: result.latestPrices,
      totalStockValue: result.totalStockValue
    });
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
  async getPriceOfAllStocks() {
    // this should also create an object of ticker: latestPrice to be passed down as a prop to StockPortfolio -> SingleStock
    let totalsOfEach = [];
    let latestPrices = {};
    if (this.state.user && this.state.user.transactions.length) {
      await Promise.all(
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
  // this triggers a component rerender by updating the state
  addStock() {
    this.getUpdatedUser();
  }
  render() {
    return (
      <div className="App">
        {this.state.user && this.state.totalStockValue && (
          <div>
            <NavBar user={this.state.user} />
            <div id={"portfolio_container"}>
              <h1 id={"portfolio_header"}>
                Total Value of {this.state.user.name}'s Stocks: $
                {this.state.totalStockValue}
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
        )}
      </div>
    );
  }
}

export default UserPortfolio;
