import React from "react";
import axios from "axios";

class SingleStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      latestPrice: 0
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
    console.log("singleStock component did mount");
    const newPrice = await this.callApi();
    if (newPrice) {
      this.setState({
        latestPrice: newPrice
      });
      if (newPrice < this.props.stock.price) {
        this.setState({ color: "#ff0066" });
      } else if (newPrice > this.props.stock.price) {
        this.setState({ color: "#00ff00" });
      } else {
        this.setState({ color: "lightgray" });
      }
    }
  }
  render() {
    return (
      <div id="stock_container">
        {this.state.latestPrice && (
          <div className={"stock"}>
            <h3
              className={"stock_item"}
              style={{
                textDecoration: "none",
                color: this.state.color
              }}
            >
              {this.props.stock.name}
            </h3>
            <h3
              className={"stock_item"}
              style={{
                textDecoration: "none",
                color: this.state.color
              }}
            >
              {this.props.stock.quantity} Shares
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
              ${(this.props.stock.quantity * this.state.latestPrice).toFixed(2)}
            </h3>
          </div>
        )}
      </div>
    );
  }
}

export default SingleStock;
