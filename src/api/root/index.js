import { Router } from 'express';
import RootHandler from './handler.js';

const rootHandler = new RootHandler();

const router = Router();

router.use('*', rootHandler.notFoundHandler);

export default router;
