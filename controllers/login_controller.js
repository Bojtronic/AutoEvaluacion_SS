const pool = require("../database/connection");
const queries = require("../queries/users_query");

/* =========================================
   LOGIN
========================================= */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            queries.login,
            [username, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Credenciales inválidas"
            });
        }

        res.status(200).json({
            success: true,
            role: result.rows[0].role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error en el proceso de login"
        });
    }
};

module.exports = {
    login
};
