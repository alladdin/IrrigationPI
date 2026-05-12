import express from 'express';
import relayRoutes from './routes/relayRoutes.ts';
import indexRoutes from './routes/indexRoutes.ts';
import path from "node:path";
import { create } from 'express-handlebars';

const app = express();

const hbs = create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(import.meta.dirname, '../views'));

// Routes
app.use('/api/relay', relayRoutes);
app.use('/', indexRoutes);

export default app;