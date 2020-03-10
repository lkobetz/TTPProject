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
      stocksAdded: 0
    };
    this.addStock = this.addStock.bind(this);
  }
  async componentDidMount() {
    // if statement prevents displaying data of most recent user after they log out
    if (window.sessionStorage.length) {
      const { data } = await axios.get(
        `/api/${window.sessionStorage.getItem("userId")}`
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
    let newStocks = this.state.stocksAdded;
    newStocks++;
    this.setState({
      stocksAdded: newStocks
    });
  }
  render() {
    return (
      <div className="App">
        {this.state.user && (
          <div>
            <NavBar />
            <div id={"portfolio_container"}>
              <h1 id={"portfolio_header"}>
                Total Value of {this.state.user.name}'s Stocks: $
                {this.getPriceOfAllStocks()}
              </h1>
              <div id={"portfolio_body"}>
                <StockPortfolio />
                <BuyStockForm
                  userId={this.state.user.id}
                  addStock={this.addStock}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserPortfolio;
