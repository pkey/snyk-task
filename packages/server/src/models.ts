export interface Dependency {
  name: string;
  version: string;
  dependencies: Dependency[];
}
