const pool = require("../database/connection");
const queries = require("../queries/users_query");

/* =========================================
   GET ALL USERS
========================================= */
const get = async (req, res) => {
    try {
        const result = await pool.query(queries.get);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

/* =========================================
   GET USER BY ID
========================================= */
const getById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const result = await pool.query(
            queries.getById,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
};

/* =========================================
   CREATE USER
========================================= */
const add = async (req, res) => {
    try {
        const { username, password, role_id } = req.body;

        await pool.query(
            queries.add,
            [username, password, role_id]
        );

        res.status(201).json({ message: "Usuario creado exitosamente" });

    } catch (error) {

        if (error.code === "23505") {
            return res.status(409).json({
                message: "El username ya existe"
            });
        }

        console.error(error);
        res.status(500).json({ message: error.message || "Error al crear usuario" });
    }
};

/* =========================================
   UPDATE USER
========================================= */
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { username, role_id, active } = req.body;

        const check = await pool.query(
            queries.getById,
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await pool.query(
            queries.update,
            [id, username, role_id, active]
        );

        res.status(200).json({ message: "Usuario actualizado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Error al actualizar usuario" });
    }
};

/* =========================================
   CHANGE PASSWORD
========================================= */
const changePassword = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { newPassword } = req.body;

        if (!newPassword || newPassword.trim() === "") {
            return res.status(400).json({
                message: "La contraseña no puede estar vacía"
            });
        }

        await pool.query(
            queries.changePassword,
            [id, newPassword]
        );

        res.status(200).json({
            message: "Contraseña actualizada exitosamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Error al cambiar contraseña"
        });
    }
};

/* =========================================
   ASSIGN / UPDATE EXAM FOR USER
========================================= */
const assignExam = async (req, res) => {
    try {

        const userId = parseInt(req.params.id);
        const { exam_id, attempts_allowed } = req.body;

        if (!exam_id || !attempts_allowed) {
            return res.status(400).json({
                message: "Debe enviar exam_id y attempts_allowed"
            });
        }

        await pool.query(
            queries.assignExam,
            [userId, exam_id, attempts_allowed]
        );

        res.status(200).json({
            message: "Examen asignado correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Error al asignar examen"
        });
    }
};

/* =========================================
   DELETE USER
========================================= */
const remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const check = await pool.query(
            queries.getById,
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await pool.query(
            queries.remove,
            [id]
        );

        res.status(200).json({ message: "Usuario eliminado exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Error al eliminar usuario" });
    }
};

module.exports = {
    get,
    getById,
    add,
    update,
    changePassword,
    assignExam,
    remove
};
