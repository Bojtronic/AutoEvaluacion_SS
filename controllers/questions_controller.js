const pool = require("../database/connection");
const queries = require("../queries/questions_query");

/* =========================================
   GET ALL
========================================= */
const get = async (req, res) => {
    try {
        const result = await pool.query(queries.get);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener preguntas" });
    }
};

/* =========================================
   GET BY ID
========================================= */
const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const result = await pool.query(
            queries.getById,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la pregunta" });
    }
};

/* =========================================
   GET BY TOPIC
========================================= */
const getByTopic = async (req, res) => {
    try {

        const topicId = parseInt(req.query.topic_id);

        if (!Number.isInteger(topicId)) {
            return res.status(400).json({
                error: "topic_id inválido"
            });
        }

        const result = await pool.query(
            queries.getByTopic,
            [topicId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

/* =========================================
   CREATE
========================================= */
const add = async (req, res) => {
    try {

        const { topic_id, question_text, options } = req.body;

        if (!topic_id || !question_text || !options || options.length === 0) {
            return res.status(400).json({
                message: "Datos incompletos"
            });
        }

        const result = await pool.query(
            queries.add,
            [topic_id, question_text, JSON.stringify(options)]
        );

        const data = result.rows[0].result;

        res.status(201).json({
            message: "Pregunta creada exitosamente",
            question_id: data.question_id,
            options: data.options
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message || "Error al crear la pregunta"
        });
    }
};

/* =========================================
   UPDATE
========================================= */
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { topic_id, question_text } = req.body;

        const check = await pool.query(
            queries.getById,
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        await pool.query(
            queries.update,
            [id, topic_id, question_text]
        );

        res.status(200).json({ message: "Pregunta actualizada exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Error al actualizar la pregunta" });
    }
};

/* =========================================
   DELETE
========================================= */
const remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const check = await pool.query(
            queries.getById,
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        await pool.query(
            queries.remove,
            [id]
        );

        res.status(200).json({ message: "Pregunta eliminada exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Error al eliminar la pregunta" });
    }
};

/* =========================================
   UPLOAD AN IMAGE FOR AN SPECIFIC OPTION
========================================= */
const uploadOptionImage = async (req, res) => {
    try {

        const { option_id } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "No se subió ninguna imagen"
            });
        }

        if (!option_id) {
            return res.status(400).json({
                message: "option_id es requerido"
            });
        }

        await pool.query(
            queries.upsertOptionImage,
            [
                option_id,
                req.file.buffer,
                req.file.mimetype,
                req.file.originalname
            ]
        );

        res.json({ message: "Imagen guardada correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al subir imagen"
        });
    }
};

/* =========================================
   GET AN IMAGE FROM AN SPECIFIC OPTION
========================================= */
const getOptionImage = async (req, res) => {
    try {

        const option_id = parseInt(req.params.option_id);

        const result = await pool.query(
            queries.getOptionImage,
            [option_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Imagen no encontrada");
        }

        const img = result.rows[0];

        res.set("Content-Type", img.mime_type);
        res.send(img.image_data);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener imagen");
    }
};

module.exports = {
    get,
    getById,
    getByTopic,
    add,
    update,
    remove,
    uploadOptionImage,
    getOptionImage
};
