import React from "react";
import SingleStock from "./SingleStock";

const StockPortfolio = props => {
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
