import React from "react";
import axios from "axios";

class BuyStockForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
      quantity: 0,
      price: 0,
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
      <div>
        {this.state.user && (
          <form
            className={"portfolio_item"}
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
          </form>
        )}
      </div>
    );
  }

  onTickerChange(event) {
    this.setState({ ticker: event.target.value });
  }

  onQuantityChange(event) {
    this.setState({ quantity: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let contains = false;
    for (let i = 0; i < this.state.user.transactions.length; i++) {
      if (this.state.user.transactions[i].name === this.state.ticker) {
        contains = true;
      }
    }
    // handles the payment
    if (contains) {
      await axios.put(`/api/${this.props.userId}`, this.state);
    } else {
      await axios.post(`/api/${this.props.userId}`, this.state);
    }
    this.props.addStock();
    this.resetForm();
  }
  resetForm() {
    this.setState({ ticker: "", quantity: 0 });
  }
}

export default BuyStockForm;
