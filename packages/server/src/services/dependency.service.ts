import { Dependency } from "../models";

class DependencyService {
  constructor() {}

  //Default depth is 0
  async getDependencies(name, version, depth = 0): Promise<Dependency> {
    return;
  }
}

export default DependencyService;
