import { Button, Input, Select } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import React from "react";
import DependencyTree from "./components/DependencyTree";
import "./index.css";

const { Option } = Select;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packageName: "",
      version: "",
      depth: 0,
      treeData: undefined,
      loading: false,
      message: "Try it out!"
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
          <Select
            defaultValue="0"
            style={{ width: 120 }}
            onChange={this.onDepthChange}
          >
            <Option value="0">0</Option>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
          </Select>
          <Button
            type="primary"
            onClick={this.onClick}
            loading={this.state.loading}
          >
            Search
          </Button>
        </div>

        <DependencyTree
          treeData={this.state.treeData}
          message={this.state.message}
        />
      </div>
    );
  }

  onPackageNameChange = event => {
    this.setState({
      packageName: event.target.value
    });
  };

  onDepthChange = value => {
    this.setState({
      depth: value
    });
  };

  onVersionChange = event => {
    this.setState({
      version: event.target.value
    });
  };

  onClick = () => {
    this.setState({
      loading: true,
      message: ""
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
          treeData: undefined,
          message: error.response.data
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
