import React from "react";
import SingleStock from "./SingleStock";

const StockPortfolio = props => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     user: this.props.user
  //   };
  // }
  // async componentDidMount() {
  //   const { data } = await axios.get(
  //     `/api/${window.sessionStorage.getItem("userId")}`
  //   );
  //   this.setState({ user: data });
  // }
  // this 'listens' for the state change in UserPortfolio and rerenders this component if a new transaction has been made
  // async componentDidUpdate(prevProps, prevState) {
  //   const { data } = await axios.get(
  //     `/api/${window.sessionStorage.getItem("userId")}`
  //   );
  //   const newTransaction = JSON.stringify(
  //     data.transactions[this.state.user.transactions.length - 1]
  //   );
  //   if (prevState.user) {
  //     const lastTransaction = JSON.stringify(
  //       prevState.user.transactions[this.state.user.transactions.length - 1]
  //     );
  //     if (prevState.user && lastTransaction !== newTransaction) {
  //       this.setState({ user: data });
  //     } else {
  //       return false;
  //     }
  //   }
  // }
  return (
    <div className={"portfolio_item"}>
      {props.user && (
        <div id={"stock_list"}>
          {props.user.transactions.map(stock => (
            <SingleStock stock={stock} user={props.user} key={stock.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StockPortfolio;
