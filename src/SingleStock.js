import React from "react";
import axios from "axios";

class SingleStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      ticker: this.props.stock.name,
      latestPrice: this.props.stock.latestPrice
    };
  }
  async callApi() {
    const { data } = await axios.get(`/api/${this.props.user.id}/apicall`, {
      params: {
        ticker: this.props.stock.name
      }
    });
    return data.latestPrice;
  }
  async componentDidMount() {
    const newPrice = await this.callApi();
    if (newPrice) {
      this.setState({
        latestPrice: (newPrice * this.props.stock.quantity).toFixed(2)
      });
    }
  }
  // making API calls in componentDidUpdate results in a billion api calls
  // try making request to user's data instead?
  // async componentDidUpdate(prevProps, prevState) {
  //   console.log(this.state.latestPrice);
  //   const newTransaction = JSON.stringify(
  //     this.state.user.transactions[this.state.user.transactions.length - 1]
  //   );
  //   if (prevProps.user) {
  //     const lastTransaction = JSON.stringify(
  //       prevProps.user.transactions[this.state.user.transactions.length - 1]
  //     );
  //     const newPrice = await this.callApi();
  //     console.log("newPrice from componentDidUpdate:", newPrice);
  //     if (prevProps.user && lastTransaction !== newTransaction && newPrice) {
  //       this.setState({
  //         latestPrice: (newPrice * this.props.stock.quantity).toFixed(2)
  //       });
  //     } else {
  //       return false;
  //     }
  //   }
  // }
  render() {
    return (
      <div id="stock_container">
        <div className={"stock"}>
          <h3 className={"stock_item"}>{this.props.stock.name}</h3>
          <h3 className={"stock_item"}>{this.props.stock.quantity} Shares</h3>
          <h3 className={"stock_item"}>=</h3>
          <h3 className={"stock_item"}>${this.state.latestPrice}</h3>
        </div>
      </div>
    );
  }
}

export default SingleStock;
