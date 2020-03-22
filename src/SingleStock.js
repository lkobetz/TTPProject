import React from "react";
import axios from "axios";

class SingleStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      stock: this.props.stock,
      latestPrice: this.props.stock.latestPrice,
      color: ""
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
      if (newPrice < this.state.stock.price) {
        this.setState({ color: "#ff0066" });
      } else if (newPrice > this.state.stock.price) {
        this.setState({ color: "#00ff00" });
      } else {
        this.setState({ color: "lightgray" });
      }
    }
  }
  render() {
    return (
      <div id="stock_container">
        <div className={"stock"}>
          <h3
            className={"stock_item"}
            style={{
              textDecoration: "none",
              color: this.state.color
            }}
          >
            {this.state.stock.name}
          </h3>
          <h3
            className={"stock_item"}
            style={{
              textDecoration: "none",
              color: this.state.color
            }}
          >
            {this.state.stock.quantity} Shares
          </h3>
          <h3
            className={"stock_item"}
            style={{
              textDecoration: "none",
              color: this.state.color
            }}
          >
            =
          </h3>
          <h3
            className={"stock_item"}
            style={{
              textDecoration: "none",
              color: this.state.color
            }}
          >
            ${this.state.latestPrice}
          </h3>
        </div>
      </div>
    );
  }
}

export default SingleStock;
