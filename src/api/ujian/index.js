import { Router } from 'express';
import {
  verifyTokenAdmin,
  verifyTokenSiswa,
  verifyTokenUmum
} from '../../middelwares/verifyToken.js';
import UjianHandler from './handler.js';

const ujianHandler = new UjianHandler();
const router = Router();
// TODO verify get change admin
router.get('/', verifyTokenUmum, ujianHandler.getHandler);
router.post('/', verifyTokenAdmin, ujianHandler.postHandler);
router.put('/aktifkan/:_id', verifyTokenAdmin, ujianHandler.actifHandler);
router.put('/nonaktifkan/:_id', verifyTokenAdmin, ujianHandler.nonaktifHandler);
router.delete('/:_id', verifyTokenAdmin, ujianHandler.hapusHandler);
router.get('/create_token', verifyTokenAdmin, ujianHandler.setToken);
router.get('/token_ujian', verifyTokenAdmin, ujianHandler.getToken);
router.get('/logs', verifyTokenAdmin, ujianHandler.getLogsHandler);
router.delete(
  '/logs/:id',
  verifyTokenAdmin,
  ujianHandler.deleteLogsByIdHandler
);
router.get(
  '/score_by_ujian/:idUjian',
  verifyTokenAdmin,
  ujianHandler.getScoresByUjian
);
router.post('/mulai', verifyTokenSiswa, ujianHandler.mulaiHandler);
router.put(
  '/update_jawaban',
  verifyTokenSiswa,
  ujianHandler.updateJawabanHandler
);
router.post(
  '/lihat_jawaban/:idScore',
  verifyTokenSiswa,
  ujianHandler.getScoreSiswaHandler
);
router.post('/selesai/:idScore', verifyTokenSiswa, ujianHandler.selesaiHandler);
router.post('/pertanyaan', verifyTokenSiswa, ujianHandler.getPerSoalSiswa);
router.get('/siswa', verifyTokenSiswa, ujianHandler.getByKelasSiswaHandler);
router.get('/pre_test/:idUjian', verifyTokenSiswa, ujianHandler.preTestHandler);
router.get('/hitung/:idScore', ujianHandler.calculateHandler);
router.get('/:_id', verifyTokenAdmin, ujianHandler.getByIdHandler);

export default router;
