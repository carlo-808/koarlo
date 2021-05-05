# Koa Simple

Simple Koa Application for testing the Node.js agent.

Enjoy

Add a `newrelic.js`config file

### Generate CPU profile and flamegraphs

Use [flamebearer](https://github.com/mapbox/flamebearer)

Run this command to generate graph:

`node --prof-process --preprocess -j path-to-proifle.log | flamebearer`