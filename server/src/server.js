import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';

connectDatabase().then(() => app.listen(config.port, () => console.info(`API listening on port ${config.port}`)))
  .catch((error) => { console.error('Failed to start API', error); process.exit(1); });
