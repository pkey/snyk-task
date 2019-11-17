import { Button } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import React from "react";
import DependencyTree from "./components/DependencyTree";
import "./index.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //TODO: Change this later
      packageName: "express",
      version: "latest",
      depth: 0,
      treeData: undefined,
      loading: false
    };
  }
  render() {
    return (
      <div className="App">
        <Button
          type="primary"
          onClick={this.onClick}
          loading={this.state.loading}
        >
          Search
        </Button>
        <DependencyTree treeData={this.state.treeData} />
      </div>
    );
  }

  onClick = () => {
    this.setState({
      loading: true
    });
    axios
      .get(
        `api/?name=${this.state.packageName}&version=${this.state.version}&depth=${this.state.depth}`
      )
      .then(response => {
        this.setState({
          treeData: response.data
        });
      })
      .catch(error => {
        this.setState({
          treeData: undefined
        });
      })
      .finally(() => {
        this.setState({
          loading: false
        });
      });
  };
}

export default App;
