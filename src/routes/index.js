import { Router } from 'express';
import auth from '../api/auth/index.js';
import guru from '../api/guru/index.js';
import kelas from '../api/kelas/index.js';
import pengumuman from '../api/pengumuman/index.js';
import root from '../api/root/index.js';
import sekolah from '../api/sekolah/index.js';
import siswa from '../api/siswa/index.js';
import soal from '../api/soal/index.js';
import ujian from '../api/ujian/index.js';

const router = Router();
router.use('/auth', auth);
router.use('/sekolah', sekolah);
router.use('/kelas', kelas);
router.use('/siswa', siswa);
router.use('/guru', guru);
router.use('/pengumuman', pengumuman);
router.use('/soal', soal);
router.use('/ujian', ujian);
router.use('/', root);

export default router;
