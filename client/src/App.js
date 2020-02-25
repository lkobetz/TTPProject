import React from "react";
import "./App.css";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }
  async getResponse(info) {
    const { data } = await axios.post("/api/register", info);
    console.log(data);
  }
  render() {
    return (
      <div className="App">
        <h1>changes</h1>
        <button
          onClick={() =>
            this.getResponse({
              name: "Blob",
              email: "blob@blob.com",
              password: "blobspassword"
            })
          }
        >
          log response
        </button>
      </div>
    );
  }
}

export default App;
