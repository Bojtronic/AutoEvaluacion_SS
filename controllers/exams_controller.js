const pool = require("../database/connection");
const queries = require("../queries/exams_query");

/* =========================================
   GET ALL EXAMS
========================================= */
const get = async (req, res) => {
    try {
        const result = await pool.query(queries.get);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener exámenes" });
    }
};

/* =========================================
   GET EXAM BY ID
========================================= */
const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const result = await pool.query(
            queries.getById,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Examen no encontrado" });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el examen" });
    }
};

/* =========================================
   CREATE EXAM
========================================= */
const add = async (req, res) => {
    try {
        const { name } = req.body;

        await pool.query(
            queries.add,
            [name]
        );

        res.status(201).json({ message: "Examen creado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el examen" });
    }
};

/* =========================================
   UPDATE EXAM
========================================= */
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;

        const check = await pool.query(
            queries.getById,
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Examen no encontrado" });
        }

        await pool.query(
            queries.update,
            [id, name]
        );

        res.status(200).json({ message: "Examen actualizado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el examen" });
    }
};

/* =========================================
   DELETE EXAM
========================================= */
const remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const check = await pool.query(
            queries.getById,
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Examen no encontrado" });
        }

        await pool.query(
            queries.remove,
            [id]
        );

        res.status(200).json({ message: "Examen eliminado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el examen" });
    }
};
