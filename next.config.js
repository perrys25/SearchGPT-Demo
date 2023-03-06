const withTwin = require('./config/withTwin.js')
const withPWA = require('next-pwa')({
  dest: 'public'
})

/**
 * @type {import('next').NextConfig}
 */
module.exports = withPWA(withTwin({
  reactStrictMode: true,
  swcMinify: true
}))
