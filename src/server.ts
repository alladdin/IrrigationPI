import app from './app.ts';
import config from './config/config.ts';

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

process.on('SIGINT', _ => {
  server.close();
});

process.on('exit', _ => {
  server.close();
});