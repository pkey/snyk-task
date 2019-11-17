import axios from "axios";
import { Dependency } from "../models";

class DependencyService {
  private maxDepth;
  constructor() {}

  //Default depth is set to 0 - if none provided will return just the dependency
  async getDependencies(name, version, depth = 0): Promise<Dependency> {
    this.maxDepth = depth;
    return await this.getTree(name, version, 0);
  }

  async getTree(name, version, currentDepth) {
    const dependency: Dependency = {
      name: name,
      version: version,
      dependencies: []
    };

    if (currentDepth === this.maxDepth) return dependency;

    const response = await axios.get(
      `https://registry.npmjs.org/${name}/${version}`
    );

    const dependencies = {
      ...response.data.dependencies,
      ...response.data.devDependencies
    };

    const dependencyPromises: Promise<Dependency>[] = [];

    for (let name of Object.keys(dependencies)) {
      dependencyPromises.push(
        this.getTree(name, dependencies[name], currentDepth + 1)
      );
    }

    await Promise.all(dependencyPromises).then((dependencies: any) => {
      dependency.dependencies = dependencies;
    });

    return dependency;
  }
}

export default DependencyService;
