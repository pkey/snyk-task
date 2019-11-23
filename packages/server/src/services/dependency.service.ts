import axios from "axios";
import axiosRetry from "axios-retry";
import semver from "semver";
import { Dependency } from "../models";

//Sometimes server would give ECONNRESET or ENOTFOUND, even though dependency is there
axiosRetry(axios, {
  retryCondition: error =>
    error.code === "ECONNRESET" || error.code === "ENOTFOUND"
});

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
      name,
      version,
      dependencies: []
    };

    if (currentDepth >= this.maxDepth) return dependency;
    if (version.includes("git")) return dependency;

    const parsedVersion =
      version === "latest" ? version : this.parseVersion(version);

    let response;
    try {
      response = await axios.get(
        `https://registry.npmjs.org/${name}/${parsedVersion}`
      );
    } catch (e) {
      switch (e.response.status) {
        //Mostly to handle the case when semver return 0.0.0 - and this version can't be found.
        case 404:
          response = await axios.get(
            `https://registry.npmjs.org/${name}/latest`
          );
          break;
        //Some of the dependencies in private scopes can't be accessed
        case 401:
          console.log(
            "Can't access dependency " + name + ", version: " + parsedVersion
          );
          return dependency;
        default:
          throw e;
      }
    }

    const dependencies = {
      ...response.data.dependencies,
      ...response.data.devDependencies
    };

    const dependencyPromises: Promise<Dependency>[] = [];

    Object.keys(dependencies).forEach(name => {
      dependencyPromises.push(
        this.getTree(name, dependencies[name], currentDepth + 1)
      );
    });

    await Promise.all(dependencyPromises).then((dependencies: any) => {
      dependency.dependencies = dependencies;
    });

    return dependency;
  }

  parseVersion(rawVersion) {
    let parsedVersion;
    try {
      parsedVersion = semver.minVersion(rawVersion);
    } catch {
      parsedVersion = semver.minVersion(
        semver.clean(rawVersion, { loose: true })
      );
    }

    return parsedVersion.version;
  }
}

export default DependencyService;
