const getAllResults = "SELECT * FROM fn_results_all()";
const createAttempt = "SELECT fn_attempt_create($1, $2) AS attempt_id";
const saveAnswer = "SELECT fn_attempt_answer_save($1, $2, $3)";
const finishAttempt = "SELECT fn_attempt_finish($1) AS score";
const getResultsByUser = "SELECT * FROM fn_results_by_user($1)";
const getAttemptDetail = "SELECT * FROM fn_attempt_detail($1)";

module.exports = {
    getAllResults,
    createAttempt,
    saveAnswer,
    finishAttempt,
    getResultsByUser,
    getAttemptDetail
};
