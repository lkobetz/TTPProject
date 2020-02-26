import React from "react";
import axios from "axios";
import SingleStock from "./SingleStock";

class StockPortfolio extends React.Component {
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
