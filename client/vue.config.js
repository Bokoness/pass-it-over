const { defineConfig } = require("@vue/cli-service")
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  // devServer: {
  //   proxy: `http://localhost:${process.env.SERVER_PORT}`,
  // },
  devServer: {
    proxy: {
      '^/api': {
        target: `http://localhost:${process.env.SERVER_PORT}`,
        ws: true,
        changeOrigin: true
      },
      'json$': {
        target: `http://localhost:${process.env.SERVER_PORT}`,
        ws: true,
        changeOrigin: true
      }
    }
  }
})
