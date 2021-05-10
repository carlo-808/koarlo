# Koa Simple

Simple Koa Application for testing the Node.js agent.

Enjoy

Add a `newrelic.js`config file

### Generate CPU profile and flamegraphs

Generate the node profile output using these commands: `node --prof app.js`
Script example can be seen here: https://github.com/carlo-808/koarlo/blob/main/package.json#L10

There are examples for generating a cpu profile in the package.json as well, but that cannot be used with flamebearer.

Use [flamebearer](https://github.com/mapbox/flamebearer)

Run this command to generate graph:

`node --prof-process --preprocess -j path-to-proifle.log | flamebearer`
