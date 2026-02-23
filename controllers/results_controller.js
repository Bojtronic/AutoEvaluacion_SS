const PDFDocument = require("pdfkit");
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

const downloadAttemptPDF = async (req, res) => {
    try {

        console.log("PARAMS:", req.params);

        const attemptId = parseInt(req.params.attempt_id);

        if (isNaN(attemptId)) {
            return res.status(400).json({
                message: "ID de intento inválido"
            });
        }

        const detail = await pool.query(
            queries.getAttemptDetail,
            [attemptId]
        );

        if (detail.rows.length === 0) {
            return res.status(404).json({
                message: "Intento no encontrado"
            });
        }

        const data = detail.rows;

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=resultado_${attemptId}.pdf`
        );

        doc.pipe(res);

        // ===== HEADER =====
        const first = data[0];

        doc.fontSize(18).text("Reporte de Evaluación", { align: "center" });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Usuario: ${first.username}`);
        doc.text(`Examen: ${first.exam_name}`);
        doc.text(`Nota: ${first.score}`);
        doc.text(`Fecha inicio: ${new Date(first.started_at).toLocaleString()}`);
        doc.text(`Fecha fin: ${new Date(first.finished_at).toLocaleString()}`);
        doc.moveDown();

        // ===== DETALLE =====
        doc.fontSize(14).text("Detalle de Respuestas");
        doc.moveDown();

        data.forEach((row, index) => {
            doc.fontSize(11).text(
                `${index + 1}. ${row.question_text}`
            );

            doc.text(`Respuesta seleccionada: ${row.selected_option_text}`);

            doc.fillColor(row.is_correct ? "green" : "red")
                .text(row.is_correct ? "Correcta" : "Incorrecta");

            doc.fillColor("black");
            doc.moveDown();
        });

        // ===== RESUMEN FINAL =====
        const correct = data.filter(r => r.is_correct).length;
        const incorrect = data.length - correct;

        doc.moveDown();
        doc.fontSize(12).text("Resumen:");
        doc.text(`Respuestas correctas: ${correct}`);
        doc.text(`Respuestas incorrectas: ${incorrect}`);

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error generando PDF"
        });
    }
};

const downloadUserLastAttemptPDF = async (req, res) => {
    try {

        const userId = parseInt(req.params.user_id);

        if (isNaN(userId)) {
            return res.status(400).json({
                message: "ID de usuario inválido"
            });
        }

        const detail = await pool.query(
            queries.getLastAttemptByUser,
            [userId]
        );

        if (detail.rows.length === 0) {
            return res.status(404).json({
                message: "El usuario no tiene intentos finalizados"
            });
        }

        const data = detail.rows;

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=resultado_usuario_${userId}.pdf`
        );

        doc.pipe(res);

        const first = data[0];

        doc.fontSize(18).text("Reporte de Evaluación", { align: "center" });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Usuario: ${first.username}`);
        doc.text(`Examen: ${first.exam_name}`);
        doc.text(`Intento #: ${first.attempt_number}`);
        doc.text(`Nota: ${first.score}`);
        doc.text(`Fecha inicio: ${new Date(first.started_at).toLocaleString()}`);
        doc.text(`Fecha fin: ${new Date(first.finished_at).toLocaleString()}`);
        doc.moveDown();

        doc.fontSize(14).text("Detalle de Respuestas");
        doc.moveDown();

        data.forEach((row, index) => {
            doc.fontSize(11).text(`${index + 1}. ${row.question_text}`);
            doc.text(`Respuesta seleccionada: ${row.selected_option}`);
            doc.fillColor(row.is_correct ? "green" : "red")
                .text(row.is_correct ? "Correcta" : "Incorrecta");
            doc.fillColor("black");
            doc.moveDown();
        });

        const correct = data.filter(r => r.is_correct).length;
        const incorrect = data.length - correct;

        doc.moveDown();
        doc.fontSize(12).text("Resumen:");
        doc.text(`Respuestas correctas: ${correct}`);
        doc.text(`Respuestas incorrectas: ${incorrect}`);
        doc.text(`Intentos usados: ${first.attempts_used}`);
        doc.text(`Intentos restantes: ${first.attempts_remaining}`);

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error generando PDF"
        });
    }
};

module.exports = {
    getAllResults,
    createAttempt,
    saveAnswer,
    finishAttempt,
    getResultsByUser,
    getAttemptDetail,
    downloadAttemptPDF,
    downloadUserLastAttemptPDF
};
