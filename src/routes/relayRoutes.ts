import express, { Router } from 'express';
import {getRelay, getRelays, setAllRelays, setRelay} from "../controllers/relayController.ts";

const router = Router();

router.use(express.json());

router.get('/', getRelays);
router.get('/:id', getRelay);
router.put('/:id', setRelay);
router.put('/', setAllRelays);

export default router;