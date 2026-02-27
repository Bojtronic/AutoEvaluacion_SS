const login = "SELECT * FROM fn_users_login($1, $2);";

module.exports = {
    login
};