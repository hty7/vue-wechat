'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // 微信接口
      '/wx1': {
        target: 'https://wx.qq.com',
        secure: false,
        changeOrigin: true,
        headers: {
          Referer: 'https://wx.qq.com'
        },
        pathRewrite: {
          '^/wx1': '/'
        },
        onProxyRes: function(proxyRes, req, res) {
          var cookies = proxyRes.headers['set-cookie']
          var cookieRegex = /Secure/i
          //修改cookie secure
          if (cookies) {
            var newCookie = cookies.map(function(cookie) {
              if (cookieRegex.test(cookie)) {
                return cookie.replace(cookieRegex, '')
              }
              return cookie
            })
            //修改cookie path
            delete proxyRes.headers['set-cookie']
            proxyRes.headers['set-cookie'] = newCookie
          }
        },
        // 重写cookie domian
        cookieDomainRewrite: {
          '*': 'localhost'
        }
      },
      '/wx2': {
        target: 'https://wx2.qq.com',
        secure: false,
        changeOrigin: true,
        headers: {
          Referer: 'https://wx2.qq.com'
        },
        pathRewrite: {
          '^/wx2': '/'
        },
        onProxyRes: function(proxyRes, req, res) {
          var cookies = proxyRes.headers['set-cookie']
          var cookieRegex = /Secure/i
          //修改cookie secure
          if (cookies) {
            var newCookie = cookies.map(function(cookie) {
              if (cookieRegex.test(cookie)) {
                return cookie.replace(cookieRegex, '')
              }
              return cookie
            })
            //修改cookie path
            delete proxyRes.headers['set-cookie']
            proxyRes.headers['set-cookie'] = newCookie
          }
        },
        // 重写cookie domian
        cookieDomainRewrite: {
          '*': 'localhost'
        }
      },
      '/login': {
        target: 'https://login.wx.qq.com',
        secure: false,
        changeOrigin: true,
        headers: {
          Referer: 'https://login.wx.qq.com'
        },
        pathRewrite: {
          '^/login': '/'
        }
      },
      '/check1': {
        target: 'https://webpush.wx.qq.com',
        secure: false,
        changeOrigin: true,
        headers: {
          Referer: 'https://webpush.wx.qq.com'
        },
        pathRewrite: {
          '^/check1': '/'
        }
      },
      '/check2': {
        target: 'https://webpush.wx2.qq.com',
        secure: false,
        changeOrigin: true,
        headers: {
          Referer: 'https://webpush.wx2.qq.com'
        },
        pathRewrite: {
          '^/check2': '/'
        }
      },
      '/upload1': {
        target: 'https://file.wx.qq.com',
        secure: false,
        changeOrigin: true,
        headers: {
          Referer: 'https://file.wx.qq.com'
        },
        pathRewrite: {
          '^/upload1': '/'
        },
      },
      '/upload2': {
        target: 'https://file.wx2.qq.com',
        secure: false,
        changeOrigin: true,
        headers: {
          Referer: 'https://file.wx2.qq.com'
        },
        pathRewrite: {
          '^/upload2': '/'
        }
      }
    },
    
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST localhost
    port: process.env.PORT || 8060, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/wechat/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
