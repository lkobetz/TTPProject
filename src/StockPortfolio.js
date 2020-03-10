import React from "react";
import axios from "axios";
import SingleStock from "./SingleStock";

class StockPortfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      stocksAdded: this.props.quantity
    };
  }
  async componentDidMount() {
    const { data } = await axios.get(
      `/api/${window.sessionStorage.getItem("userId")}`
    );
    this.setState({ user: data });
  }
  async componentDidUpdate(prevProps, prevState) {
    const { data } = await axios.get(
      `/api/${window.sessionStorage.getItem("userId")}`
    );

    const newTransaction = JSON.stringify(
      data.transactions[this.state.user.transactions.length - 1]
    );
    if (prevState.user) {
      const lastTransaction = JSON.stringify(
        prevState.user.transactions[this.state.user.transactions.length - 1]
      );
      console.log(lastTransaction, newTransaction);
      if (prevState.user && lastTransaction !== newTransaction) {
        this.setState({ user: data });
      } else {
        console.log(false);
      }
    }
  }
  render() {
    return (
      <div className={"portfolio_item"}>
        {this.state.user && (
          <div id={"stock_list"}>
            {this.state.user.transactions.map(stock => (
              <SingleStock
                stock={stock}
                user={this.state.user}
                key={stock.id}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default StockPortfolio;
