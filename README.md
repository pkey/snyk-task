# Snyk Homework Task :dog:

## Essence

Getting a dependency tree of a npm package based on version and package name

## How to run it

1. `npm i`
2. `npm run start`

## API

`/*` - GET, with the following query parameters:

- name: npm package name (string)
- version: npm package version (string)
- depth: depth of the dependency tree to query (number)

Example: `localhost:3001?name=express&version=latest&depth=1`

## Further improvements

- Some package versions are still not parsed well - would have to debug and see which ones
- Didn't have time to implement **caching**. Having _package name_, _version_ and _difference of maximum depth and ongoing depth_ as a key it would be possible to cache every queried dependency in a ready to consume form
- More sophisticated error handling with parameter validation
- Client could be improved to query dependencies only when user presses tree arrow
