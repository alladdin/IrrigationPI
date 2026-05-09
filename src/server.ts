import app from './app.ts';
import config from './config/config.ts';
import {destroyRegistry} from "./utils/destroyRegistry.ts";
import exitHook from 'exit-hook';

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

exitHook(() => {
  destroyRegistry.finish();
  server.close();
  console.log('Server shutdown complete');
});