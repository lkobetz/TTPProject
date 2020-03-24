import React from "react";
import axios from "axios";
import NavBar from "./NavBar";

class UserTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }
  async componentDidMount() {
    const { data } = await axios.get(
      `/api/${window.localStorage.getItem("userId")}`
    );
    this.setState({ user: data });
  }
  render() {
    return (
      <div className="App">
        {this.state.user && (
          <div>
            <NavBar user={this.state.user} />
            <div id={"portfolio_container"}>
              <div id={"portfolio_body"}>
                <div id={"transaction_container"}>
                  <h2 id={"transactions_list"}>Transaction History:</h2>
                  {this.state.user && (
                    <div>
                      {this.state.user.transactions.map(stock => (
                        <div className={"stock"}>
                          <h3 className={"stock_item"}>BUY</h3>
                          <h3 className={"stock_item"}>{stock.name}</h3>
                          <h3 className={"stock_item"}>
                            Shares: {stock.quantity}
                          </h3>
                          <h3 className={"stock_item"}>@</h3>
                          <h3 className={"stock_item"}>${stock.price}</h3>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserTransactions;
