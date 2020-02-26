import React from "react";
// import axios from "axios";

class SingleStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      ticker: this.props.stock.name
    };
  }
  getTotalCostOfStock() {
    // I couldn't get this api call to work even though it worked in postman
    // const { data } = await axios.get(
    //   `/api/${this.state.user.id}/apicall`,
    //   this.state
    // );
    // if (data.latestPrice) {
    //   return data.latestPrice * this.props.stock.quantity;
    // } else {
    return (
      parseInt(this.props.stock.price) * parseInt(this.props.stock.quantity)
    );
    // }
  }
  render() {
    const stockCost = this.getTotalCostOfStock();
    return (
      <div className="App">
        <div className={"stock"}>
          <h3>{this.props.stock.name}</h3>
          <h3>Shares: {this.props.stock.quantity}</h3>
          <h3>=</h3>
          <h3>${stockCost}</h3>
        </div>
      </div>
    );
  }
}

export default SingleStock;
