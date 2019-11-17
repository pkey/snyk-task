import { Button, Input } from "antd";
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
      packageName: "",
      version: "",
      depth: 0,
      treeData: undefined,
      loading: false
    };
  }
  render() {
    return (
      <div className="App">
        <div class="data-input">
          <Input
            placeholder="Package Name"
            onChange={this.onPackageNameChange}
          />
          <Input placeholder="Version" onChange={this.onVersionChange} />
          <Input placeholder="Depth" onChange={this.onDepthChange} />
          <Button
            type="primary"
            onClick={this.onClick}
            loading={this.state.loading}
          >
            Search
          </Button>
        </div>

        <DependencyTree treeData={this.state.treeData} />
      </div>
    );
  }

  onPackageNameChange = event => {
    this.setState({
      packageName: event.target.value
    });
  };

  onDepthChange = event => {
    this.setState({
      depth: event.target.value
    });
  };

  onVersionChange = event => {
    this.setState({
      version: event.target.value
    });
  };

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
