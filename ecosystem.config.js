module.exports = {
  apps: [
    {
      name: 'test-server',
      script: 'dist/src/main.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'env',
      },
    },
  ],
};
