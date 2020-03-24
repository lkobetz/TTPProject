import React from "react";
import axios from "axios";

class BuyStockForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
      quantity: 0,
      price: 0,
      user: this.props.user,
      alert: 0
    };
  }

  onTickerChange(event) {
    this.setState({ ticker: event.target.value });
  }

  onQuantityChange(event) {
    this.setState({ quantity: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ alert: 0 });
    let contains = false;
    for (let i = 0; i < this.state.user.transactions.length; i++) {
      if (this.state.user.transactions[i].name === this.state.ticker) {
        contains = true;
      }
    }
    // handles the payment
    try {
      if (contains) {
        await axios.put(`/api/${this.props.userId}`, this.state);
      } else {
        await axios.post(`/api/${this.props.userId}`, this.state);
      }
    } catch (error) {
      if (error.response && error.response.status) {
        this.setState({ alert: error.response.status });
      }
    }
    // this triggers the UserPortfolio component to rerender
    this.props.addStock();
    // this rerenders the component because it updates the state with new info
    const { data } = await axios.get(
      `/api/${window.localStorage.getItem("userId")}`
    );
    this.setState({ user: data });
    this.resetForm();
  }
  resetForm() {
    this.setState({ ticker: "", quantity: 0 });
  }

  render() {
    return (
      <div className={"portfolio_item"}>
        {this.state.user && (
          <form
            className={"form_item"}
            onSubmit={this.handleSubmit.bind(this)}
            method="POST"
          >
            <div>
              {this.state.user && <h3>Cash: ${this.state.user.cash}</h3>}
              <input
                className={"form_item"}
                type="text"
                value={this.state.ticker}
                placeholder={"Ticker Symbol"}
                onChange={this.onTickerChange.bind(this)}
              />
            </div>
            <br />
            <div>
              <input
                className={"form_item"}
                type="text"
                value={this.state.quantity}
                placeholder={"Quantity"}
                onChange={this.onQuantityChange.bind(this)}
              />
            </div>{" "}
            <br />
            <button type="submit" className="submit_button">
              Buy
            </button>
            {this.state.alert === 400 && <h3>Not enough cash!</h3>}
            {this.state.alert === 404 && (
              <h3>Please select a valid ticker symbol</h3>
            )}
          </form>
        )}
      </div>
    );
  }
}

export default BuyStockForm;
