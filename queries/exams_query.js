// ================================
// EXAMS
// ================================

const get = "SELECT * FROM fn_exams_get_all()";
const getById = "SELECT * FROM fn_exams_get_by_id($1)";
const add = "SELECT fn_exams_create($1::VARCHAR)";
const update = "SELECT fn_exams_update($1::INTEGER, $2::VARCHAR)";
const remove = "SELECT fn_exams_delete($1)";


// ================================
// EXAM TOPICS
// ================================

const getTopicsByExam = "SELECT * FROM fn_exam_topics_get_by_exam($1)";
const addTopic = "SELECT fn_exam_topics_add($1, $2)";
const removeTopic = "SELECT fn_exam_topics_remove($1, $2)";


// ================================
// EXAM QUESTIONS
// ================================

const getQuestionsByExam = "SELECT * FROM fn_exam_questions_get_by_exam($1)";
const addQuestion = "SELECT fn_exam_questions_add($1, $2)";
const removeQuestion = "SELECT fn_exam_questions_remove($1, $2)";


module.exports = {
    // Exams
    get,
    getById,
    add,
    update,
    remove,

    // Exam Topics
    getTopicsByExam,
    addTopic,
    removeTopic,

    // Exam Questions
    getQuestionsByExam,
    addQuestion,
    removeQuestion
};
