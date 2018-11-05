Test Suite
==========

These tests are browser-based tests, using [Puppeteer](https://github.com/GoogleChrome/puppeteer) and [Jest](https://jestjs.io/docs/en/puppeteer) to simulate user interaction with the [educ.io](https://educ.io) site and web-apps.

This testing is essential to ensure that code releases are high-quality, and do not introduce bugs or functionality impairments into the system.

A configuration file can be passed to the node process using environmental variables, see the [example config](https://github.com/Educ-IO/educ-io-tests/blob/master/example-config.json) for details of the format.

	env TEST_CONFIG="example-config.json"

Various parts of the test suite can also report back on timings, if you wish to check performance as part of the test run.

	env TEST_TIMED=true