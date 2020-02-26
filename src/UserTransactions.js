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
      `/api/${window.sessionStorage.getItem("userId")}`
    );
    this.setState({ user: data });
  }
  render() {
    return (
      <div className="App">
        {this.state.user && (
          <div>
            <NavBar />
            <div id={"portfolio_container"}>
              <div id={"portfolio_body"}>
                <div className="App">
                  <h2>Transaction History:</h2>
                  {this.state.user && (
                    <h3>
                      {this.state.user.transactions.map(stock => (
                        <div className={"stock"}>
                          <h3>BUY</h3>
                          <h3>{stock.name}</h3>
                          <h3>Shares: {stock.quantity}</h3>
                          <h3>@</h3>
                          <h3>${stock.price}</h3>
                        </div>
                      ))}
                    </h3>
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
