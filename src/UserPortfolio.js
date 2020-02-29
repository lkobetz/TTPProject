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
  }
  async componentDidMount() {
    const { data } = await axios.get(
      `/api/${window.sessionStorage.getItem("userId")}`
    );
    this.setState({ user: data });
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
  render() {
    return (
      <div className="App">
        {this.state.user && (
          <div>
            <NavBar />
            <div id={"portfolio_container"}>
              <h1 id={"portfolio_header"}>
                Total Value of My Stocks: ${this.getPriceOfAllStocks()}
              </h1>
              <div id={"portfolio_body"}>
                <StockPortfolio />
                <BuyStockForm userId={this.state.user.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserPortfolio;
