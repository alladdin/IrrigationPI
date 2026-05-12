import app from './app.ts';
import config from 'config';
import {destroyRegistry} from "./utils/destroyRegistry.ts";
import exitHook from 'exit-hook';
import type {ServerConfig} from "./config/severConfig.ts";

const serverConfig: ServerConfig = config.get('server');
const port = serverConfig.port;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

exitHook(() => {
  destroyRegistry.finish();
  server.close();
  console.log('Server shutdown complete');
});