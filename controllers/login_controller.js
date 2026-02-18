const pool = require("../database/connection");
const queries = require('../queries/login_query');

const login = async (req, res) => {
    try {
        const { user, password } = req.body;

        if (!user || !password) {
            return res.status(400).json({
                success: false,
                message: "Usuario y contraseña requeridos"
            });
        }

        const result = await pool.query(queries.auth, [user, password]);

        const role = result.rows[0].authenticate_user;

        if (!role) {
            return res.status(401).json({
                success: false,
                message: "Credenciales incorrectas"
            });
        }

        return res.status(200).json({
            success: true,
            role: role
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
};


module.exports = {
    login
}
