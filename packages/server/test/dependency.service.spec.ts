let chai = require("chai");
import "mocha";
import nock from "nock";
import dependencyService from "../src/services/dependency.service";
const { expect } = chai;

describe("DependencyService", () => {
  beforeEach(() => {
    nock("https://registry.npmjs.org")
      .get(/\/.*/)
      .reply(200, {
        dependencies: {},
        devDependencies: {}
      });
  });
  afterEach(() => {
    nock.cleanAll();
  });
  it("should return a properly formatted dependency", async () => {
    expect(
      await new dependencyService().getDependencies("dep", "latest")
    ).to.eql({
      name: "dep",
      version: "latest",
      dependencies: []
    });
  });

  //Would be better to check what argument axios was called with. Not sure how to test this.
  it("should parse the version before calling axios", async () => {
    expect(
      await new dependencyService().getDependencies("dep", "~1.0.0")
    ).to.eql({
      name: "dep",
      version: "~1.0.0",
      dependencies: []
    });
  });

  it("should stop querying further if dependency version is git based", async () => {
    expect(
      await new dependencyService().getDependencies(
        "dep",
        "github:someone/dep.js",
        1
      )
    ).to.eql({
      name: "dep",
      version: "github:someone/dep.js",
      dependencies: []
    });
  });

  it("should get latest version if dependency with provided version is not found", async () => {
    nock.cleanAll();
    nock("https://registry.npmjs.org")
      .get("/dep/0.0.0")
      .reply(404);
    nock("https://registry.npmjs.org")
      .get("/dep/latest")
      .reply(200, {
        dependencies: { dep1: "1.0.0" },
        devDependencies: {}
      });

    expect(
      await new dependencyService().getDependencies("dep", "0.0.0", 1)
    ).to.eql({
      name: "dep",
      version: "0.0.0",
      dependencies: [
        {
          name: "dep1",
          version: "1.0.0",
          dependencies: []
        }
      ]
    });
  });

  it("should return both dev and normal dependencies", async () => {
    nock.cleanAll();
    nock("https://registry.npmjs.org")
      .get("/dep/latest")
      .reply(200, {
        dependencies: { normalDep: "latest" },
        devDependencies: { devDep: "latest" }
      });
    expect(
      await new dependencyService().getDependencies("dep", "latest", 1)
    ).to.eql({
      name: "dep",
      version: "latest",
      dependencies: [
        {
          name: "normalDep",
          version: "latest",
          dependencies: []
        },
        {
          name: "devDep",
          version: "latest",
          dependencies: []
        }
      ]
    });
  });

  it("should stop fetching if depth limit is reached", async () => {
    nock.cleanAll();
    nock("https://registry.npmjs.org")
      .get("/dep/latest")
      .reply(200, {
        dependencies: { normalDep: "latest" },
        devDependencies: { devDep: "latest" }
      });
    expect(
      await new dependencyService().getDependencies("dep", "latest", 0)
    ).to.eql({
      name: "dep",
      version: "latest",
      dependencies: []
    });
  });

  describe("when depth is set", () => {
    beforeEach(() => {
      //Mock responses from npmjs
      nock.cleanAll();
      nock("https://registry.npmjs.org")
        .get("/dep/latest")
        .reply(200, {
          dependencies: { dep1: "latest" },
          devDependencies: { dep2: "latest" }
        });
      nock("https://registry.npmjs.org")
        .get("/dep1/latest")
        .reply(200, {
          dependencies: { dep11: "latest" },
          devDependencies: { dep12: "latest" }
        });
      nock("https://registry.npmjs.org")
        .get("/dep2/latest")
        .reply(200, {
          dependencies: { dep21: "latest" },
          devDependencies: { dep22: "latest" }
        });
    });
    it("should return nested dependencie (1 level)", async () => {
      expect(
        await new dependencyService().getDependencies("dep", "latest", 1)
      ).to.eql({
        name: "dep",
        version: "latest",
        dependencies: [
          {
            name: "dep1",
            version: "latest",
            dependencies: []
          },
          {
            name: "dep2",
            version: "latest",
            dependencies: []
          }
        ]
      });
    });
    it("should return nested dependencies (2 levels)", async () => {
      expect(
        await new dependencyService().getDependencies("dep", "latest", 2)
      ).to.eql({
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
      });
    });
  });
});
