const withTwin = require('./config/withTwin.js')

/**
 * @type {import('next').NextConfig}
 */
module.exports = withTwin({
  reactStrictMode: true,
  swcMinify: true
})
