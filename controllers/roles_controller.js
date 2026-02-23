const pool = require("../database/connection");
const queries = require("../queries/roles_query");

/* =========================================
   GET ALL ROLES
========================================= */
const get = async (req, res) => {
    try {
        const result = await pool.query(queries.get);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener roles" });
    }
};


module.exports = {
    get
};
