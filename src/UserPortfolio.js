import React from "react";
import axios from "axios";

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
    console.log(data);
    this.setState({ user: data });
  }
  render() {
    return (
      <div className="App">
        {this.state.user && <h3>{this.state.user.name}</h3>}
        {/* <NavBar />
        <StockPortfolio />
        <BuyStockForm /> */}
        {/* this component needs three nested components:
        a navbar to display either portfolio or transactions
        one with the stocks owned
        (with the total price for all of their shares), makes an api call for
        each stock to get its current price, then multiplies that price times
        the quantity owned
        one with a form to buy a new stock that makes an api
        call to add that stock to the database */}
      </div>
    );
  }
}

export default UserPortfolio;
