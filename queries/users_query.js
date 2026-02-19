/* =========================================
   USERS
========================================= */

const get = "SELECT * FROM fn_users_get_all()";
const getById = "SELECT * FROM fn_users_get_by_id($1)";
const add = "SELECT fn_users_create($1, $2, $3)";
const update = "SELECT fn_users_update($1, $2, $3, $4)";
const changePassword = "SELECT fn_users_change_password($1, $2)";
const remove = "SELECT fn_users_delete($1)";

/* =========================================
   LOGIN
========================================= */

const login = "SELECT * FROM fn_users_login($1, $2)";

module.exports = {
    get,
    getById,
    add,
    update,
    changePassword,
    remove,
    login
};
