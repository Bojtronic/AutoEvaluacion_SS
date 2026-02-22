const get = "SELECT * FROM fn_questions_get_all()";
const getById = "SELECT * FROM fn_questions_get_by_id($1)";
const getByTopic = "SELECT * FROM fn_questions_get_by_topic($1)";
const add = "SELECT fn_questions_create($1, $2)";
const update = "SELECT fn_questions_update($1, $2, $3)";
const remove = "SELECT fn_questions_delete($1)";


module.exports = {
    get,
    getById,
    getByTopic,
    add,
    update,
    remove
};
