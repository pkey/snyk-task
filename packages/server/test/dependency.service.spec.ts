let chai = require("chai");
import dependencyService from "../src/services/dependency.service";

const { expect } = chai;

describe("DependencyService", () => {
  it("should return a properly formatted dependency", async () => {
    expect(new dependencyService().getDependencies("dep", "latest")).to.eql({
      name: "dep",
      version: "latest",
      dependencies: []
    });
  });

  it("should return both dev and normal dependencies", async () => {
    expect(new dependencyService().getDependencies("dep", "latest")).to.eql({
      name: "dep",
      version: "latest",
      dependencies: [
        {
          name: "devDep",
          version: "latest",
          dependencies: []
        },
        {
          name: "normalDep",
          version: "latest",
          dependencies: []
        }
      ]
    });
  });

  describe("when depth is set", () => {
    it("should return nested dependencies and stop fetching more", async () => {
      expect(
        new dependencyService().getDependencies("dep", "latest", 1)
      ).to.eql({
        name: "dep",
        version: "latest",
        dependencies: [
          {
            name: "devDep",
            version: "latest",
            dependencies: []
          },
          {
            name: "normalDep",
            version: "latest",
            dependencies: []
          }
        ]
      });
    });
  });
});
