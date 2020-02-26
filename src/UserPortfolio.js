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
  addNewStock(stock) {}
  render() {
    return (
      <div className="App">
        {this.state.user && (
          <div>
            <NavBar />
            <StockPortfolio />
            <BuyStockForm userId={this.state.user.id} />
            {/* this component needs three nested components:
        a navbar to display either portfolio or transactions
        one with the stocks owned
        (with the total price for all of their shares), makes an api call for
        each stock to get its current price, then multiplies that price times
        the quantity owned
        one with a form to buy a new stock that makes an api
        call to add that stock to the database */}
          </div>
        )}
      </div>
    );
  }
}

export default UserPortfolio;
