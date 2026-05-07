import express from 'express';
import relayRoutes from './routes/relayRoutes.ts';

const app = express();

app.use(express.json());

// Routes
app.use('/api/relay', relayRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from IrrigationPI server!' });
});

export default app;