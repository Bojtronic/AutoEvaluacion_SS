// ================== BACKUP QUERIES ==================

// EXPORT
const getBackupData = "SELECT fn_backup_get_all() AS data";
const getBackupImages = "SELECT fn_backup_get_images() AS images";

// RESTORE
const restoreData = "SELECT fn_backup_restore($1)";
const restoreImages = "SELECT fn_backup_restore_images($1)";

// LIMPIEZA TOTAL (opcional si ya se hace dentro de restore)
const clearAll = "SELECT fn_backup_clear_all()";

module.exports = {
    getBackupData,
    getBackupImages,
    restoreData,
    restoreImages,
    clearAll
};
