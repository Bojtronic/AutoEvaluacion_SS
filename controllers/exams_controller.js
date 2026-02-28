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

        const result = await pool.query(
            queries.add,
            [name]
        );

        const newId = result.rows[0].id;

        res.status(201).json({
            id: newId,
            name
        });

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

/* =========================================
   GET TOPICS BY EXAM
========================================= */
const getTopics = async (req, res) => {
    try {
        const examId = parseInt(req.params.id);

        const result = await pool.query(
            queries.getTopicsByExam,
            [examId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener temas del examen" });
    }
};

/* =========================================
   ADD TOPIC TO EXAM
========================================= */
const addTopic = async (req, res) => {
    try {
        const examId = parseInt(req.params.id);
        const { topic_id } = req.body;

        await pool.query(
            queries.addTopic,
            [examId, topic_id]
        );

        res.status(201).json({ message: "Tema asignado al examen" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al asignar tema al examen" });
    }
};

/* =========================================
   REMOVE TOPIC FROM EXAM
========================================= */
const removeTopic = async (req, res) => {
    try {
        const examId = parseInt(req.params.id);
        const topicId = parseInt(req.params.topicId);

        await pool.query(
            queries.removeTopic,
            [examId, topicId]
        );

        res.status(200).json({ message: "Tema eliminado del examen" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar tema del examen" });
    }
};

/* =========================================
   GET QUESTIONS BY EXAM
========================================= */
const getQuestions = async (req, res) => {
    try {
        const examId = parseInt(req.params.id);

        const result = await pool.query(
            queries.getQuestionsByExam,
            [examId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener preguntas del examen" });
    }
};

/* =========================================
   ADD QUESTION TO EXAM
========================================= */
const addQuestion = async (req, res) => {
    try {
        const examId = parseInt(req.params.id);
        const { question_id } = req.body;

        await pool.query(
            queries.addQuestion,
            [examId, question_id]
        );

        res.status(201).json({ message: "Pregunta asignada al examen" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al asignar pregunta al examen" });
    }
};

/* =========================================
   REMOVE QUESTION FROM EXAM
========================================= */
const removeQuestion = async (req, res) => {
    try {
        const examId = parseInt(req.params.id);
        const questionId = parseInt(req.params.questionId);

        await pool.query(
            queries.removeQuestion,
            [examId, questionId]
        );

        res.status(200).json({ message: "Pregunta eliminada del examen" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar pregunta del examen" });
    }
};


const startExam = async (req, res) => {
    try {

        const { user_id, exam_id } = req.body;

        // VALIDACIÓN DE SEGURIDAD
        if (!user_id || !exam_id) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos para iniciar el examen"
            });
        }

        const result = await pool.query(
            queries.startExam,
            [user_id, exam_id]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No se encontraron preguntas para este examen"
            });
        }

        const attempt_id = result.rows[0].attempt_id;

        const questionsMap = {};

        result.rows.forEach(row => {

            if (!questionsMap[row.question_id]) {
                questionsMap[row.question_id] = {
                    id: row.question_id,
                    topic: row.topic,
                    question: row.question,
                    options: []
                };
            }

            questionsMap[row.question_id].options.push({
                id: row.option_id,
                text: row.option_text
            });
        });

        const formattedQuestions = Object.values(questionsMap);

        res.status(200).json({
            success: true,
            attempt_id,
            questions: formattedQuestions
        });

    } catch (error) {

        console.error("Start exam error:", error.message);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



const finishExam = async (req, res) => {
    try {

        const { attempt_id, answers } = req.body;

        if (!attempt_id || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos para finalizar el examen"
            });
        }

        const result = await pool.query(
            queries.finishExam,
            [attempt_id, JSON.stringify(answers)]
        );

        const data = result.rows[0];

        res.status(200).json({
            success: true,
            score: data.score,
            correct: data.correct,
            incorrect: data.incorrect
        });

    } catch (error) {

        console.error("Finish exam error:", error.message);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



module.exports = {
    get,
    getById,
    add,
    update,
    remove,
    getTopics,
    addTopic,
    removeTopic,
    getQuestions,
    addQuestion,
    removeQuestion,
    startExam,
    finishExam
};
