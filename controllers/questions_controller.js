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
        const { topic_id } = req.query;

        if (topic_id) {
            const result = await pool.query(
                queries.getByTopic,
                [topic_id]
            );
            return res.json(result.rows);
        }

        const result = await pool.query(
            queries.get
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
        const { topic_id, question_text } = req.body;

        await pool.query(
            queries.add,
            [topic_id, question_text]
        );

        res.status(201).json({ message: "Pregunta creada exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Error al crear la pregunta" });
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

module.exports = {
    get,
    getById,
    getByTopic,
    add,
    update,
    remove
};
