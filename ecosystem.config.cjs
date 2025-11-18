module.exports = {
  apps: [
    {
      name: `hq-main`,
      script: 'npm',
      args: 'start',
      env: {
        // PM2_SERVE_PATH: './dist',
        PORT: 3000,
        // PM2_SERVE_SPA: 'true',
        NODE_ENV: 'production',
      },
    },
  ],
};
