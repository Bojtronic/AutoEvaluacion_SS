const pool = require("../database/connection");
const queries = require("../queries/topics_query");

/* =========================================
   GET ALL
========================================= */
const get = async (req, res) => {
    try {
        const result = await pool.query(queries.get);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener temas" });
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
            return res.status(404).json({ message: "Tema no encontrado" });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el tema" });
    }
};

/* =========================================
   CREATE
========================================= */
const add = async (req, res) => {
    try {
        const { name, description } = req.body;

        await pool.query(
            queries.add,
            [name, description]
        );

        res.status(201).json({ message: "Tema creado exitosamente" });

    } catch (error) {

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Ya existe un tema con ese nombre"
            });
        }

        console.error(error);
        res.status(500).json({ message: "Error al crear el tema" });
    }
};

/* =========================================
   UPDATE
========================================= */
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, description } = req.body;

        const check = await pool.query(
            queries.getById,
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Tema no encontrado" });
        }

        await pool.query(
            queries.update,
            [id, name, description]
        );

        res.status(200).json({ message: "Tema actualizado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el tema" });
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
            return res.status(404).json({ message: "Tema no encontrado" });
        }

        await pool.query(
            queries.remove,
            [id]
        );

        res.status(200).json({ message: "Tema eliminado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el tema" });
    }
};

module.exports = {
    get,
    getById,
    add,
    update,
    remove
};
