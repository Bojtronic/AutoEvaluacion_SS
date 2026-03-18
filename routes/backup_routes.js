const { Router } = require('express');
const controller = require('../controllers/backup_controller');

const router = Router();

/* =========================================
   DOWNLOAD BACKUP
   GET /api/backup/download
========================================= */
router.get('/download', controller.download);

/* =========================================
   RESTORE BACKUP
   POST /api/backup/restore
========================================= */
router.post('/restore', controller.restore);

module.exports = router;
