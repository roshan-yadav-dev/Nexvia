const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

const startServer = async () => {
  try {
    await connectDB();
    const port = env.PORT || 5001;
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port} in ${env.NODE_ENV} mode`);
      console.log(`👉 Health check: http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
