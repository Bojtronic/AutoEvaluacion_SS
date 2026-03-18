const pool = require("../database/connection");
const queries = require("../queries/backup_query");

const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

/* =========================================
   DOWNLOAD BACKUP
========================================= */
const download = async (req, res) => {
    try {

        // UNA sola query para todo
        const dataResult = await pool.query(queries.getBackupData);
        const imagesResult = await pool.query(queries.getBackupImages);

        const data = dataResult.rows[0].data;
        const images = imagesResult.rows[0].images;

        // Headers
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=backup.zip");

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);

        // JSON principal
        archive.append(JSON.stringify(data, null, 2), {
            name: "data.json"
        });

        // JSON de imágenes (BASE64)
        archive.append(JSON.stringify(images, null, 2), {
            name: "images.json"
        });

        await archive.finalize();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generando backup" });
    }
};



/* =========================================
   RESTORE BACKUP
========================================= */
const restore = async (req, res) => {
    try {

        if (!req.files || !req.files.backup) {
            return res.status(400).json({ message: "Archivo no enviado" });
        }

        const file = req.files.backup;

        const tempZip = "./temp_backup.zip";
        const extractPath = "./temp_restore";

        // Guardar ZIP
        await file.mv(tempZip);

        // Limpiar carpeta previa
        if (fs.existsSync(extractPath)) {
            fs.rmSync(extractPath, { recursive: true, force: true });
        }

        // Extraer ZIP
        await fs.createReadStream(tempZip)
            .pipe(unzipper.Extract({ path: extractPath }))
            .promise();

        // Leer JSONs
        const data = JSON.parse(
            fs.readFileSync(`${extractPath}/data.json`, "utf-8")
        );

        const images = JSON.parse(
            fs.readFileSync(`${extractPath}/images.json`, "utf-8")
        );

        // TRANSACCIÓN
        await pool.query("BEGIN");

        // TODO el restore en PostgreSQL
        await pool.query(
            queries.restoreData,
            [JSON.stringify(data)]
        );

        await pool.query(
            queries.restoreImages,
            [JSON.stringify(images)]
        );

        await pool.query("COMMIT");

        // Limpiar temporales
        fs.rmSync(tempZip, { force: true });
        fs.rmSync(extractPath, { recursive: true, force: true });

        res.status(200).json({ message: "Backup restaurado correctamente" });

    } catch (error) {

        await pool.query("ROLLBACK");

        console.error(error);
        res.status(500).json({ message: "Error restaurando backup" });
    }
};

module.exports = {
    download,
    restore
};
