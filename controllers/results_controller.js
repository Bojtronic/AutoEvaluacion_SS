const pool = require("../database/connection");
const queries = require("../queries/results_query");

/* =========================================
   GET ALL RESULTS
========================================= */
const getAllResults = async (req, res) => {
    try {
        const result = await pool.query(
            queries.getAllResults
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener todos los resultados"
        });
    }
};

/* =========================================
   CREATE ATTEMPT
========================================= */
const createAttempt = async (req, res) => {
    try {
        const { user_id, exam_id } = req.body;

        const result = await pool.query(
            queries.createAttempt,
            [user_id, exam_id]
        );

        res.status(201).json({
            message: "Intento creado exitosamente",
            attempt_id: result.rows[0].attempt_id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Error al crear el intento"
        });
    }
};

/* =========================================
   SAVE ANSWER
========================================= */
const saveAnswer = async (req, res) => {
    try {
        const { attempt_id, question_id, selected_option_id } = req.body;

        await pool.query(
            queries.saveAnswer,
            [attempt_id, question_id, selected_option_id]
        );

        res.status(200).json({
            message: "Respuesta guardada correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Error al guardar la respuesta"
        });
    }
};

/* =========================================
   FINISH ATTEMPT
========================================= */
const finishAttempt = async (req, res) => {
    try {
        const { attempt_id } = req.body;

        const result = await pool.query(
            queries.finishAttempt,
            [attempt_id]
        );

        res.status(200).json({
            message: "Examen finalizado correctamente",
            score: result.rows[0].score
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Error al finalizar el examen"
        });
    }
};

/* =========================================
   GET RESULTS BY USER
========================================= */
const getResultsByUser = async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);

        const result = await pool.query(
            queries.getResultsByUser,
            [user_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener los resultados"
        });
    }
};

/* =========================================
   GET ATTEMPT DETAIL
========================================= */
const getAttemptDetail = async (req, res) => {
    try {
        const attempt_id = parseInt(req.params.attempt_id);

        const result = await pool.query(
            queries.getAttemptDetail,
            [attempt_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Intento no encontrado"
            });
        }

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener el detalle del intento"
        });
    }
};

module.exports = {
    getAllResults,
    createAttempt,
    saveAnswer,
    finishAttempt,
    getResultsByUser,
    getAttemptDetail
};
