import "antd/dist/antd.css";
import React from "react";
import DependencyTree from "./components/DependencyTree";
import "./index.css";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: {
        name: "dep",
        version: "latest",
        dependencies: [
          {
            name: "dep1",
            version: "latest",
            dependencies: [
              {
                name: "dep11",
                version: "latest",
                dependencies: []
              },
              {
                name: "dep12",
                version: "latest",
                dependencies: []
              }
            ]
          },
          {
            name: "dep2",
            version: "latest",
            dependencies: [
              {
                name: "dep21",
                version: "latest",
                dependencies: []
              },
              {
                name: "dep22",
                version: "latest",
                dependencies: []
              }
            ]
          }
        ]
      }
    };
  }
  render() {
    return (
      <div className="App">
        <DependencyTree treeData={this.state.treeData} />
      </div>
    );
  }
}

export default App;
