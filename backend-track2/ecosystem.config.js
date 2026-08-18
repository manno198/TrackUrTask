module.exports = {
  apps: [
    {
      name: 'trackurtask-api',
      script: 'src/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
