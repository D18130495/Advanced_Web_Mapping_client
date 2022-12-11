module.exports = {
  devServer: {
    proxy: {
      '/xml': {
        target: 'http://api.irishrail.ie/realtime/realtime.asmx/',
        changeOrigin:true,
        pathRewrite: {
          '^/xml': ''
        }
      }
    }
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      importWorkboxFrom: 'local',
      importsDirectory: 'js',
      navigateFallback: '/',
      navigateFallbackBlacklist: [/\/api\//]
    }
  }
}
