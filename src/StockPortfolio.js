import React from "react";
import axios from "axios";

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
    console.log(data);
    this.setState({ user: data });
  }
  render() {
    return (
      <div className="App">
        {this.state.user && (
          <h3>
            {this.state.user.transactions.map(stock => (
              <h4>{stock.name}</h4>
            ))}
          </h3>
        )}
      </div>
    );
  }
}

export default StockPortfolio;
