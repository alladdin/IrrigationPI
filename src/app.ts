import express from 'express';
import relayRoutes from './routes/relayRoutes.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

const app = express();

app.use(express.json());

// Routes
app.use('/api/relay', relayRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;