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
  async componentDidMount() {
    const { data } = await axios.get(`/api/${this.state.user.id}/apicall`, {
      params: {
        ticker: this.props.stock.name
      }
    });
    if (data.latestPrice) {
      this.setState({
        latestPrice: data.latestPrice * this.props.stock.quantity
      });
    }
  }
  render() {
    console.log(this.props.stock);
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
