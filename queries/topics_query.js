const get = "SELECT * FROM fn_topics_get_all()";
const getById = "SELECT * FROM fn_topics_get_by_id($1)";
const add = "SELECT fn_topics_create($1, $2)";
const update = "SELECT fn_topics_update($1, $2, $3)";
const remove = "SELECT fn_topics_delete($1)";


module.exports = {
    get,
    getById,
    add,
    update,
    remove
}