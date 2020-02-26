import React from "react";
import axios from "axios";

class BuyStockForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
      quantity: 0
    };
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} method="POST">
        <div>
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
    const response = await axios.post(`/api/${this.props.userId}`, this.state);
    console.log("response.data from axios", response.data);
    // if (response.data.status === "success") {
    //   alert(
    //     "Thank you! I have received your message and will get back to you shortly!"
    //   );
    //   this.resetForm();
    // } else if (response.data.status === "fail") {
    //   alert("Your message has failed to send.");
    // }
    this.resetForm();
  }
  resetForm() {
    this.setState({ ticker: "", quantity: 0 });
  }
}

export default BuyStockForm;
