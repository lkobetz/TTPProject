import React from "react";

class SingleStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      latestPrice: 0
    };
  }
  // removed callAPI function from here and put it in UserPortfolio
  async componentDidMount() {
    // newPrice will have to be passed down as a prop. no need to call API here (it's called above), just find the stock's latestPrice by finding its ticker name in the passed down object
    const newPrice = this.props.allLatestPrices[this.props.stock.name];
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
              {/* must include props here (don't just use componentDidMount to get latestPrice) in order to get the latest price to rerender when props change, ie when a purchase is made */}
              ${(this.props.stock.quantity * this.state.latestPrice).toFixed(2)}
            </h3>
          </div>
        )}
      </div>
    );
  }
}

export default SingleStock;
