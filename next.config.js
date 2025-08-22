// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',         // service worker + precache manifest output
  disable: process.env.NODE_ENV === 'development', // sw off in dev (optional)
  register: true,
  skipWaiting: true
})

module.exports = withPWA({
  reactStrictMode: true
})