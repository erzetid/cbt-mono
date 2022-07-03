import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { verifyTokenAdmin } from '../../middelwares/verifyToken.js';
import SoalHandler from './handler.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), 'assets/'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const soalHandler = new SoalHandler();
const router = Router();

router.get('/', verifyTokenAdmin, soalHandler.getHandler);
router.get('/export/:_id', soalHandler.exportHandler);
router.get('/:_id', verifyTokenAdmin, soalHandler.getByIdhandler);
router.get('/per_soal/:_id', verifyTokenAdmin, soalHandler.getPerSoal);
router.post('/', verifyTokenAdmin, soalHandler.postHandler);
router.delete('/:_id', verifyTokenAdmin, soalHandler.deleteHandler);
router.put('/pertanyaan', verifyTokenAdmin, soalHandler.edipertanyaanHandler);
router.put('/opsi', verifyTokenAdmin, soalHandler.editOpsiJawaban);
router.put('/jawaban', verifyTokenAdmin, soalHandler.setJawaban);
router.post(
  '/upload',
  upload.single('file'),
  verifyTokenAdmin,
  soalHandler.uploadHandler
);
router.post(
  '/import',
  upload.single('file'),
  verifyTokenAdmin,
  soalHandler.importHandler
);

export default router;
