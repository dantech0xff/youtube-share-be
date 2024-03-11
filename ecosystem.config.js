/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'YT-Share-API',
      script: 'node dist/index.js',
      env: {
        NODE_ENV: 'dev'
      },
      env_prod: {
        NODE_ENV: 'prod'
      },
      env_prod_gcp: {
        NODE_ENV: 'prod_gcp'
      }
    }
  ]
}
