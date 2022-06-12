import { Router } from 'express';
import { verifyTokenAdmin } from '../../middelwares/verifyToken.js';
import GuruHandler from './handler.js';

const router = Router();
const guruhandler = new GuruHandler();

router.post('/', verifyTokenAdmin, guruhandler.postHandler);
router.get('/:id', verifyTokenAdmin, guruhandler.getByIdHandler);
router.get('/', verifyTokenAdmin, guruhandler.getHandler);
router.delete('/:id', verifyTokenAdmin, guruhandler.deleteHandler);
router.put('/', verifyTokenAdmin, guruhandler.putHandler);

export default router;
