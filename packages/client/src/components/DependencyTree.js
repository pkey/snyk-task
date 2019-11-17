import { Tree } from "antd";
import React from "react";
const { TreeNode } = Tree;

class DependencyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: this.props.treeData
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      treeData: nextProps.treeData
    });
  }

  render() {
    return this.state.treeData ? (
      <div>
        <h1>
          {" "}
          {this.state.treeData.name} and {this.state.treeData.version}{" "}
        </h1>

        <Tree
          defaultExpandedKeys={[
            this.state.treeData.name + " " + this.state.treeData.version
          ]}
        >
          {constructTree(this.state.treeData)}
        </Tree>
      </div>
    ) : (
      "Waiting..."
    );
  }
}

function constructTree(dep) {
  const title = dep.name + " " + dep.version;
  if (dep.dependencies.length === 0) {
    return <TreeNode title={title} key={title} />;
  } else {
    let tree = [];
    for (let childDep of dep.dependencies) {
      tree.push(constructTree(childDep, childDep.dependencies));
    }
    return (
      <TreeNode title={title} key={title}>
        {tree}
      </TreeNode>
    );
  }
}

export default DependencyList;
