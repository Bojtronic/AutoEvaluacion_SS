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
                success: false,
                message: "Credenciales inválidas"
            });
        }

        const user = result.rows[0];

        // Si es admin
        if (user.role === "admin") {
            return res.status(200).json({
                success: true,
                role: user.role
            });
        }

        // Si es student
        return res.status(200).json({
            success: true,
            role: user.role,
            exam: {
                exam_id: user.exam_id,
                exam_name: user.exam_name,
                max_attempts: user.max_attempts,
                used_attempts: user.used_attempts,
                remaining_attempts: user.remaining_attempts
            }
        });

    } catch (error) {

        console.error("Login error:", error.message);

        // Aquí capturamos los RAISE EXCEPTION
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    login
};
