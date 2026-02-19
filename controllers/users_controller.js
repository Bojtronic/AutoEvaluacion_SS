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
        const { new_password } = req.body;

        await pool.query(
            queries.changePassword,
            [id, new_password]
        );

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Error al cambiar contraseña" });
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
    remove
};
